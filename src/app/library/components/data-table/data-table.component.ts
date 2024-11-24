import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EntityField } from '../../model/entityField';

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
  @Input() bookOptions: { id: number; title: string }[] = [];
  @Input() entityType: string = '';

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() filterChange = new EventEmitter<string>();

  @Output() create = new EventEmitter<any>();
  @Output() detail = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  paginatedData: any[] = [];
  displayEditModal: boolean = false;
  displayDetailModal: boolean = false;
  displayDeleteModal: boolean = false;
  itemToEdit: any = null;
  itemToDetail: any = null;
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

  onDetail(item: any): void {
    this.itemToDetail = item;
    this.displayDetailModal = true;
  }

  onEdit(item: any): void {
    this.itemToEdit = item;
    this.displayEditModal = true;
  }

  getAuthorName(authorId: number): string {
    const author = this.authorOptions.find((option) => option.id === authorId);
    return author ? author.name : 'Desconocido';
  }

  getBookTitle(bookId: number): string {
    if (!this.bookOptions || !Array.isArray(this.bookOptions)) {
      return 'Desconocido';
    }
    const book = this.bookOptions.find((option) => option.id === bookId);
    return book ? book.title : 'Desconocido';
  }

  onDelete(item: any): void {
    this.itemToDelete = item;
    this.displayDeleteModal = true;
  }

  onConfirmDeletion(isConfirmed: boolean): void {
    if (isConfirmed && this.itemToDelete) {
      this.delete.emit(this.itemToDelete);
    }
    this.displayDeleteModal = false;
  }

  onEditItem(event: any): void {
    this.itemToEdit = event;
  }
  onDetailItem(event: any): void {
    this.itemToDetail = event;
  }

  onConfirmEdition(isConfirmed: boolean): void {
    if (isConfirmed && this.itemToEdit) {
      this.edit.emit(this.itemToEdit);
    }
    this.displayEditModal = false;
  }

  onConfirmDetail(isConfirmed: boolean): void {
    if (isConfirmed && this.itemToDetail) {
      this.detail.emit(this.itemToDetail);
    }
    this.displayDetailModal = false;
  }
}
