import { Author } from './../../model/author';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EntityField } from './create-entity/entityField';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() pageSize: number = 5;
  @Input() pageIndex: number = 0;
  @Input() totalPages: number = 1;
  @Input() filterText: string = '';
  @Input() entityFields: EntityField[] = [];
  @Input() authorOptions: { id: number; name: string }[] = [];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<string>();

  @Output() create = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  paginatedData: any[] = [];
  displayEditModal: boolean = false;
  displayDeleteModal: boolean = false;
  itemToEdit: any = null;
  itemToDelete: any = null;
  visible: boolean = false;
  newItem: any = {};

  ngOnInit(): void {
    this.updatePaginationAndFilter();
  }

  onCancelCreate() {
    this.visible = false;
  }

  onCreate() {
    this.newItem = {};
    this.visible = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['data'] ||
      changes['filterText'] ||
      changes['pageSize'] ||
      changes['pageIndex']
    ) {
      this.updatePaginationAndFilter();
    }
  }

  private updatePaginationAndFilter(): void {
    const filteredData = this.filterData();
    this.applyPagination(filteredData);
  }

  private filterData(): any[] {
    if (!this.filterText) {
      return this.data;
    }
    const filterTextLower = this.filterText.toLowerCase();
    return this.data.filter((item) =>
      this.columns.some((col) =>
        item[col.field]?.toString().toLowerCase().includes(filterTextLower)
      )
    );
  }

  private applyPagination(filteredData: any[]): void {
    this.paginatedData = filteredData;
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageIndex = page;
      this.pageChange.emit(page);
      this.updatePaginationAndFilter();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageIndex = 0;
    this.pageSize = size;
    this.pageSizeChange.emit(size);
    this.pageChange.emit(this.pageIndex);
    this.updatePaginationAndFilter();
  }

  onFilterChange(): void {
    this.pageIndex = 0;
    this.filterChange.emit(this.filterText);
    this.updatePaginationAndFilter();
  }

  onEdit(item: any): void {
    console.log('onEdit DATA TABLE');
    console.log(item);
    this.itemToEdit = item;
    this.displayEditModal = true;
  }

  getAuthorName(authorId: number): string {
    const author = this.authorOptions.find((option) => option.id === authorId);
    return author ? author.name : 'Desconocido';
  }

  onDelete(item: any): void {
    this.itemToDelete = item;
    this.displayDeleteModal = true;
  }

  onConfirmDeletion(isConfirmed: boolean): void {
    if (isConfirmed && this.itemToDelete) {
      console.log('Eliminando el item:', this.itemToDelete);
      this.delete.emit(this.itemToDelete);
    }
    this.displayDeleteModal = false;
  }
  onEditItem(event: any): void {
    console.log("1 onEditItem")
    console.log(event)
    this.itemToEdit = event;
  }
  onConfirmEdition(isConfirmed: boolean): void {
    if (isConfirmed && this.itemToEdit) {
      console.log('2. Editando el item:', this.itemToEdit);
      this.edit.emit(this.itemToEdit);
    }
    this.displayEditModal = false;
  }
}
