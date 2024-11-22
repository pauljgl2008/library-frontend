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
      this.updateDateFields();  // Asegura que las fechas se actualicen si es necesario
    }
  }

  private buildForm(): void {
    const formGroup: { [key: string]: any } = {};

    // Recorremos los campos y agregamos los controles en el FormGroup
    this.entityFields.forEach(field => {
      const fieldValidators = [
        Validators.required, 
        this.notEmptyValidator, 
        ...this.getFieldValidators(field)
      ];

      // Validación de longitud máxima para el campo 'isbn'
      if (field.field === 'isbn') {
        fieldValidators.push(Validators.maxLength(13));  // Validación de 13 caracteres
      }

      // Establecer valor por defecto para campos de tipo 'date'
      let defaultValue = this.entity[field.field] || null;
      if (field.type === 'date' && !defaultValue) {
        // Si no hay valor inicial, asignar la fecha actual en formato 'yyyy-MM-dd'
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

  private addFieldSpecificValidators(field: EntityField, validators: Validators[]): void {
    switch (field.type) {
      case 'date':
        validators.push(Validators.pattern(/\d{4}-\d{2}-\d{2}/));  // Formato de fecha 'yyyy-MM-dd'
        break;
      case 'text':
        if (field.field === 'isbn') {
          // Validación de 13 caracteres numéricos para ISBN
          validators.push(Validators.pattern(/^\d{13}$/));  // Solo 13 dígitos numéricos
          validators.push(Validators.maxLength(13));         // No más de 13 caracteres
        }
        break;
    }
  }

  private resetForm(): void {
    this.entityForm.reset(this.entity);
  }

  private updateDateFields(): void {
    this.entityFields.forEach(field => {
      if (field.type === 'date') {
        const control = this.entityForm.get(field.field);
        if (control && !control.value) {
          // Si el campo de fecha no tiene valor, asignamos la fecha actual
          control.setValue(new Date().toISOString().split('T')[0]);
        }
      }
    });
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
      this.markAllFieldsAsTouched();  // Mostrar errores si el formulario es inválido
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);  // Cerrar el modal
    this.resetForm();  // Restablecer el formulario
  }

  save(): void {
    if (this.validateForm()) {
      this.isSaving = true;
      this.processAuthorField();
      setTimeout(() => {
        this.saveItem.emit(this.entityForm.value);
        this.isSaving = false;
        this.close();  // Cerrar el modal después de guardar
      }, 2000);
    } else {
      this.markAllFieldsAsTouched();  // Mostrar errores si el formulario es inválido
    }
  }

  cancel(): void {
    if (this.entityForm.invalid) {
      this.markAllFieldsAsTouched();  // Mostrar errores si el formulario es inválido
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);  // Cerrar el modal
    this.resetForm();  // Restablecer el formulario
  }

  private processAuthorField(): void {
    const author = this.entityForm.value['author'];
    if (author) {
      this.entityForm.value['author'] = Number(author);  // Convertir autor a número si está presente
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
