import { Input, Output, EventEmitter, SimpleChanges, Component } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { EntityField } from "src/app/library/model/entityField";

@Component({
  selector: 'app-detail-entity',
  templateUrl: './detail-entity.component.html',
})
export class DetailEntityComponent {
  @Input() visible: boolean = false;
  @Input() itemToDetail: any = null;
  @Output() confirmDetail = new EventEmitter<boolean>();
  @Input() entityFields: EntityField[] = [];
  @Input() formTitle: string = 'Detalle registro';
  @Input() cancelLabel: string = 'Cerrar';
  @Input() authorOptions: { id: number; name: string }[] = [];
  @Input() bookOptions: { id: number; title: string }[] = [];
  @Input() entityType: string = '';
  @Input() isReadonly: boolean = true;  // Nueva propiedad para definir si es solo lectura

  @Output() detailItem = new EventEmitter<{ [key: string]: any }>();

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
    if (changes['itemToDetail']) {
      this.updateEntityFromItem(this.itemToDetail);
      this.rebuildForm();
    }
  }
  private updateEntityFromItem(item: any): void {
    this.entity = { ...item };
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
    const defaultValue = this.getDefaultFieldValue(field);
    const controlConfig = this.isReadonly ? { value: defaultValue, disabled: true } : { value: defaultValue };
    return [controlConfig];
  }


  private getDefaultFieldValue(field: EntityField): any {
    let defaultValue = this.entity[field.field] || null;
    if (field.type === 'date' && !defaultValue) {
      defaultValue = new Date().toISOString().split('T')[0]; // Default to today's date
    }
    return defaultValue;
  }

  // Resto de la lógica...

  cancel(): void {
    this.visible = false;
    this.confirmDetail.emit(false);
    this.entityForm.reset();
  }
}
