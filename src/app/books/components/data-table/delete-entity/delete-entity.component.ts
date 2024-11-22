import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-entity',
  templateUrl: './delete-entity.component.html'
})
export class DeleteEntityComponent {

  @Input() visible: boolean = false;
  @Input() itemToDelete: any = null;
  @Output() confirmDeletion = new EventEmitter<boolean>();

  constructor() { }

  onConfirm(): void {
    this.confirmDeletion.emit(true);
  }

  onCancel(): void {
    this.confirmDeletion.emit(false);
  }
}
