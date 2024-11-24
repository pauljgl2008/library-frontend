import { BookService } from './../../services/book.service';
import { Component, OnInit } from '@angular/core';
import { EntityField } from '../../model/entityField';
import { BookResponseDto } from '../../model/book-response-dto';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loans-list-page',
  templateUrl: './loans-list-page.component.html',
})
export class LoansListPageComponent implements OnInit {
  pageIndex: number = 0;
  pageSize: number = 5;
  visible: boolean = false;
  filterText: string = '';
  totalPages: number = 1;
  bookIdToDelete: number | null = null;
  columns = [
    { header: 'Fecha de préstamo', field: 'loan_date' },
    { header: 'Fecha de devolución', field: 'return_date' },
    { header: 'Estado', field: 'status' },
    { header: 'Libro', field: 'book_id' },
    { header: 'Acciones', field: 'actions' },
  ];
  entityFields: EntityField[] = [
    { field: 'loan_date', label: 'Fecha de préstamo', type: 'date' },
    { field: 'return_date', label: 'Fecha de devolución', type: 'date' },
    { field: 'status', label: 'Estado', type: 'select' },
    { field: 'book_id', label: 'Libro', type: 'select' },
  ];
  books: any;
  loans: any;
  newBook: any = {
    title: null,
    author: null,
    isbn: null,
    publication_date: null,
    status: 'Disponible',
  };

  constructor(
    private readonly loanService: LoanService,
    private readonly bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.bookService.getAllBooks().subscribe((response: any) => {
      this.books = response;
      this.loanService.getLoans().subscribe((response: any) => {
        this.loans = response;
      });
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadData();
  }

  onFilterChange(filter: string): void {
    this.filterText = filter;
    this.loadData();
  }

  onEdit(item: any): void {
    this.updateBook(item);
  }

  updateBook(item: any) {
    this.loanService.updateLoan(item.id, item).subscribe({
      next: (response: BookResponseDto) => {
        console.log('Préstamo actualizado:', response);
        this.loadData();
      },
      error: (error) => {
        console.error('Error al actualizar el préstamo:', error);
      },
    });
  }

  onDelete(item: any): void {
    this.loanService.deleteLoan(item.id).subscribe(() => {
      this.loadData();
    });
  }

  onCreate(): void {
    this.newBook = {
      title: null,
      author: null,
      isbn: null,
      publication_date: null,
      status: 'Disponible',
    };
    this.visible = true;
  }

  onSaveItem(item: any): void {
    this.loanService.addLoan(item).subscribe((response) => {
      console.log('Libro creado:', response);
      this.loadData();
      this.visible = false;
    });
  }

  onCancelCreate(): void {
    this.visible = false;
  }
}
