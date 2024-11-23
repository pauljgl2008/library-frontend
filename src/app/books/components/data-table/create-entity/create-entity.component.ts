import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { EntityField } from '../../../model/entityField';

@Component({
  selector: 'app-create-entity',
  templateUrl: './create-entity.component.html',
})
export class CreateEntityComponent implements OnInit, OnChanges {
  @Input() visible = false;

  @Input() entity: { [key: string]: any } = {};
  @Input() entityFields: EntityField[] = [];
  @Input() authorOptions: { id: number; name: string }[] = [];

  @Input() formTitle = 'Crear registro';
  @Input() submitLabel = 'Guardar';
  @Input() cancelLabel = 'Cancelar';

  @Output() saveItem = new EventEmitter<{ [key: string]: any }>();
  @Output() visibleChange = new EventEmitter<boolean>();

  entityForm: FormGroup;
  isSaving: boolean = false;

  constructor(private readonly fb: FormBuilder) {
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
      this.updateDateFields();
    }
  }

  private buildForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.entityFields.forEach((field) => {
      const fieldValidators = [
        Validators.required,
        this.notEmptyValidator,
        ...this.getFieldValidators(field),
      ];

      if (field.field === 'isbn') {
        fieldValidators.push(Validators.maxLength(14));
      }

      let defaultValue = this.entity[field.field] || null;
      if (field.type === 'date' && !defaultValue) {
        defaultValue = new Date().toISOString().split('T')[0];
      }

      formGroup[field.field] = [defaultValue, fieldValidators];
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

  private addFieldSpecificValidators(
    field: EntityField,
    validators: Validators[]
  ): void {
    switch (field.type) {
      case 'date':
        validators.push(Validators.pattern(/\d{4}-\d{2}-\d{2}/));
        break;
      case 'text':
        if (field.field === 'isbn') {
          validators.push(Validators.pattern(/^\d{3}-\d{10}$/));
          validators.push(Validators.maxLength(14));
        }
        break;
    }
  }

  private resetForm(): void {
    this.entityForm.reset(this.entity);
  }

  private updateDateFields(): void {
    this.entityFields.forEach((field) => {
      if (field.type === 'date') {
        const control = this.entityForm.get(field.field);
        if (control && !control.value) {
          control.setValue(new Date().toISOString().split('T')[0]);
        }
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.entityForm.controls).forEach((field) => {
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
    this.hideForm();
    this.resetForm();
  }

  private hideForm(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
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
      return { notEmpty: true };
    }
    return null;
  }
}
