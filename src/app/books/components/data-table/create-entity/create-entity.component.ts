import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EntityField } from './entityField';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html'
})
export class CreateEntityComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() entity: { [key: string]: any } = {};
  @Input() entityFields: EntityField[] = [];
  @Input() authorOptions: { id: number, name: string }[] = [];
  @Output() saveItem = new EventEmitter<{ [key: string]: any }>();

  @Input() formTitle = 'Crear registro';
  @Input() submitLabel = 'Guardar';
  @Input() cancelLabel = 'Cancelar';

  entityForm: FormGroup;
  isSaving: boolean = false;

  constructor(private fb: FormBuilder) {
    this.entityForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityFields'] && !changes['entityFields'].firstChange) {
      this.buildForm();
    }
    if (changes['entity'] && !changes['entity'].firstChange) {
      this.resetForm();
    }
  }

  private buildForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.entityFields.forEach(field => {
      formGroup[field.field] = [
        this.entity[field.field] || null, 
        [Validators.required, this.notEmptyValidator, ...this.getFieldValidators(field)]
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

  private addFieldSpecificValidators(field: EntityField, validators: Validators[]): void {
    switch (field.type) {
      case 'date':
        validators.push(Validators.pattern(/\d{4}-\d{2}-\d{2}/));
        break;
      case 'text':
        if (field.field === 'isbn') {
          validators.push(Validators.pattern(/^\d{13}$/));
        }
        break;
    }
  }

  private resetForm(): void {
    this.entityForm.reset(this.entity);
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

  close(): void {
    if (this.entityForm.invalid) {
      this.markAllFieldsAsTouched();
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
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

  cancel(): void {
    if (this.entityForm.invalid) {
      this.markAllFieldsAsTouched();
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetForm();
  }

  private processAuthorField(): void {
    const author = this.entityForm.value['author'];
    if (author) {
      this.entityForm.value['author'] = Number(author);
    }
  }

  getFormControl(field: string): AbstractControl | null {
    return this.entityForm.get(field);
  }

  private notEmptyValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === '') {
      return { 'notEmpty': true };
    }
    return null;
  }
}
