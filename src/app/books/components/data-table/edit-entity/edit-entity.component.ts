import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EntityField } from '../create-entity/entityField';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
})
export class EditEntityComponent {
  @Input() visible: boolean = false;
  @Input() itemToEdit: any = null;
  @Output() confirmEdition = new EventEmitter<boolean>();
  entityForm: FormGroup;
  entity: { [key: string]: any } = {};
  @Input() entityFields: EntityField[] = [];
  @Input() formTitle = 'Editar registro';
  @Input() submitLabel = 'Guardar';
  @Input() cancelLabel = 'Cancelar';
  @Input() authorOptions: { id: number, name: string }[] = [];
  isSaving: boolean = false;
  @Output() saveItem = new EventEmitter<{ [key: string]: any }>();
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({});
  }
  ngOnInit(): void {
    console.log("hi edit entity");
    console.log(this.entity);
    console.log(this.entityFields);
    this.buildForm();
  }
  private buildForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.entityFields.forEach(field => {
      const fieldValidators = [
        Validators.required,
        this.notEmptyValidator,
        ...this.getFieldValidators(field)
      ];

      if (field.field === 'isbn') {
        fieldValidators.push(Validators.maxLength(13));
      }

      let defaultValue = this.entity[field.field] || null;
      if (field.type === 'date' && !defaultValue) {
        defaultValue = new Date().toISOString().split('T')[0];
      }

      formGroup[field.field] = [
        defaultValue,
        fieldValidators
      ];
    });

    this.entityForm = this.fb.group(formGroup);
  }
  private getFieldValidators(field: EntityField): Validators[] {
    const validators: Validators[] = [];
    if (field.pattern) {
      validators.push(Validators.pattern(new RegExp(field.pattern)));
    }
    this.addFieldSpecificValidators(field, validators);
    return validators;
  }
  private processAuthorField(): void {
    const author = this.entityForm.value['author'];
    if (author) {
      this.entityForm.value['author'] = Number(author);
    }
  }
  private addFieldSpecificValidators(field: EntityField, validators: Validators[]): void {
    switch (field.type) {
      case 'date':
        validators.push(Validators.pattern(/\d{4}-\d{2}-\d{2}/));
        break;
      case 'text':
        if (field.field === 'isbn') {
          validators.push(Validators.pattern(/^\d{13}$/));
          validators.push(Validators.maxLength(13));
        }
        break;
    }
  }
  private resetForm(): void {
    this.entityForm.reset(this.entity);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityFields'] && !changes['entityFields'].firstChange) {
      console.log("this.entityFields");
      console.log(this.entityFields);
      this.buildForm();
    }
    if (changes['itemToEdit']) {
      console.log("itemToEdit ha cambiado:", this.itemToEdit);
      this.transformItemToEntity(this.itemToEdit);
      this.buildForm();

    }
  }
  transformItemToEntity(item: any): void {
    // Asignamos las propiedades del itemToEdit al objeto entity
    this.entity = { ...item };
    console.log("transformatiomtoentiy")
    console.log(this.entity)
    console.log(this.entityFields)
  }
  private notEmptyValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === '') {
      return { 'notEmpty': true };
    }
    return null;
  }

  onConfirm(): void {
    this.confirmEdition.emit(true);
  }

  onCancel(): void {
    this.confirmEdition.emit(false);
  }
  cancel(): void {
    if (this.entityForm.invalid) {
      this.markAllFieldsAsTouched();
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  close(): void {
    if (this.entityForm.invalid) {
      this.markAllFieldsAsTouched();
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }
  private markAllFieldsAsTouched(): void {
    Object.keys(this.entityForm.controls).forEach(field => {
      const control = this.entityForm.get(field);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  validateForm(): boolean {
    return this.entityForm.valid;
  }

  save(): void {
    if (this.validateForm()) {
      this.isSaving = true;
      this.processAuthorField();
      setTimeout(() => {
        this.saveItem.emit(this.entityForm.value);
        this.isSaving = false;
        this.close();
      }, 2000);
    } else {
      this.markAllFieldsAsTouched();
    }
  }
}
