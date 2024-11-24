import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { EntityField } from '../../../model/entityField';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
})
export class EditEntityComponent {
  @Input() visible: boolean = false;
  @Input() itemToEdit: any = null;
  @Output() confirmEdition = new EventEmitter<boolean>();
  @Input() entityFields: EntityField[] = [];
  @Input() formTitle: string = 'Editar registro';
  @Input() submitLabel: string = 'Guardar';
  @Input() cancelLabel: string = 'Cancelar';
  @Input() authorOptions: { id: number; name: string }[] = [];
  @Input() bookOptions: { id: number; title: string }[] = [];
  @Input() entityType: string = '';

  @Output() editItem = new EventEmitter<{ [key: string]: any }>();

  entityForm: FormGroup;
  entity: { [key: string]: any } = {};
  isSaving: boolean = false;

  constructor(private readonly fb: FormBuilder) {
    this.entityForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityFields'] && !changes['entityFields'].firstChange) {
      this.rebuildForm();
    }
    if (changes['itemToEdit']) {
      this.updateEntityFromItem(this.itemToEdit);
      this.rebuildForm();
    }
  }

  private initializeForm(): void {
    this.rebuildForm();
  }

  private rebuildForm(): void {
    this.entityForm = this.fb.group(this.createFormGroup());
  }

  private createFormGroup(): { [key: string]: any } {
    const formGroup: { [key: string]: any } = {};
    this.entityFields.forEach((field) => {
      formGroup[field.field] = this.createFormControl(field);
    });
    return formGroup;
  }

  private createFormControl(field: EntityField) {
    const validators = [
      Validators.required,
      this.notEmptyValidator,
      ...this.getFieldValidators(field),
    ];

    const defaultValue = this.getDefaultFieldValue(field);

    return [defaultValue, validators];
  }

  private getDefaultFieldValue(field: EntityField): any {
    let defaultValue = this.entity[field.field] || null;
    if (field.type === 'date' && !defaultValue) {
      defaultValue = new Date().toISOString().split('T')[0]; // Default to today's date
    }
    return defaultValue;
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
        validators.push(Validators.pattern(/\d{4}-\d{2}-\d{2}/)); // Validate date format
        break;
      case 'text':
        if (field.field === 'isbn') {
          validators.push(Validators.pattern(/^\d{3}-\d{10}$/));
          validators.push(Validators.maxLength(14));
        }
        break;
    }
  }

  private processAuthorOrBookField(): void {
    const author = this.entityForm.value['author_id'];
    if (author) {
      this.entityForm.value['author_id'] = Number(author); // Ensure the author ID is processed correctly
    }
    const book = this.entityForm.value['book_id'];
    if (book) {
      this.entityForm.value['book_id'] = Number(book); // Ensure the author ID is processed correctly
    }
  }

  private resetForm(): void {
    this.entityForm.reset(this.entity);
  }

  private updateEntityFromItem(item: any): void {
    this.entity = { ...item };
  }

  private notEmptyValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === null || control.value === ''
      ? { notEmpty: true }
      : null;
  }

  cancel(): void {
    if (this.entityForm.invalid) {
      this.markAllFieldsAsTouched();
    }
    this.closeForm();
  }

  private closeForm(): void {
    this.visible = false;
    this.resetForm();
    this.confirmEdition.emit(false);
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

  submit(): void {
    if (this.validateForm()) {
      this.isSaving = true;
      this.processAuthorOrBookField(); // Process author field before saving
      setTimeout(() => {
        let x = this.entityForm.value;
        x['id'] = this.entity['id'];
        this.editItem.emit(this.entityForm.value);
        this.confirmEdition.emit(true);
        this.isSaving = false;
        this.closeForm();
      }, 2000);
    } else {
      this.markAllFieldsAsTouched();
    }
  }
}
