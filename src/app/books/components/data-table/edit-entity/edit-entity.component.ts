import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-entity',
  templateUrl: './edit-entity.component.html',
})
export class EditEntityComponent {
  @Input() visible: boolean = false;
  @Input() itemToEdit: any = null;
  @Output() confirmEdition = new EventEmitter<boolean>();

  constructor() {}

  onConfirm(): void {
    this.confirmEdition.emit(true);
  }

  onCancel(): void {
    this.confirmEdition.emit(false);
  }
}
