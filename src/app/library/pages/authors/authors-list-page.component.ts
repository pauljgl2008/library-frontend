import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { PaginatedBooksResponse } from '../../model/book';
import { AuthorService } from '../../services/author.service';
import { EntityField } from '../../model/entityField';
import { BookResponseDto } from '../../model/book-response-dto';

@Component({
  selector: 'app-authors-list-page',
  templateUrl: './authors-list-page.component.html'
})
export class AuthorsListPageComponent implements OnInit {

  books: any;
  pageIndex: number = 0;
  pageSize: number = 5;
  visible: boolean = false;
  filterText: string = '';
  totalPages: number = 1;
  bookIdToDelete: number | null = null;
  columns = [
    { header: 'Título', field: 'title' },
    { header: 'Autor', field: 'author' },
    { header: 'Isbn', field: 'isbn' },
    { header: 'Estado', field: 'status' },
    { header: 'Fecha de publicación', field: 'publication_date' },
    { header: 'Acciones', field: 'actions' },
  ];
  entityFields: EntityField[] = [
    { field: 'title', label: 'Título', type: 'text' },
    { field: 'author', label: 'Autor', type: 'select' },
    { field: 'isbn', label: 'ISBN', type: 'text' },
    { field: 'status', label: 'Estado', type: 'select' },
    { field: 'publication_date', label: 'Fecha de Publicación', type: 'date' }
  ];
  authors: any[] = [];
  newBook: any = {
    title: null,
    author: null,
    isbn: null,
    publication_date: null,
    status: 'Disponible'
  };

  constructor(private readonly bookService: BookService, private readonly authorSerivce: AuthorService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorSerivce.getAuthors()
      .subscribe((response: any) => {
        this.authors = response
      });
  }

  loadBooks(): void {
    this.bookService.getPaginatedBooks(this.pageIndex, this.pageSize)
      .subscribe((books: PaginatedBooksResponse) => {
        this.books = books.content;
        this.pageIndex = books.pageable.pageNumber;
        this.pageSize = books.pageable.pageSize;
        this.totalPages = books.totalPages;

        if (this.books.length === 0 && this.pageIndex > 0) {
          this.pageIndex--;
          this.loadBooks();
        }

        if (this.totalPages === 0) {
          this.totalPages = 1;
        }
      });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadBooks();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadBooks();
  }

  onFilterChange(filter: string): void {
    this.filterText = filter;
    this.loadBooks();
  }

  onEdit(item: any): void {
    this.updateBook(item);
  }

  updateBook(item: any) {
    this.bookService.updateBook(item.id, item).subscribe({
      next: (response: BookResponseDto) => {
        console.log('Libro actualizado:', response);
        this.loadBooks();
      },
      error: (error) => {
        console.error('Error al actualizar el libro:', error);
      }
    });
  }

  onDelete(item: any): void {
    this.bookService.deleteBook(item.id).subscribe(() => {
      this.loadBooks();
    });
  }

  onCreate(): void {
    this.newBook = {
      title: null,
      author: null,
      isbn: null,
      publication_date: null,
      status: 'Disponible'
    };
    this.visible = true;
  }

  onSaveItem(item: any): void {
    this.bookService.addBook(item).subscribe((response) => {
      console.log('Libro creado:', response);
      this.loadBooks();
      this.visible = false;
    });
  }

  onCancelCreate(): void {
    this.visible = false;
  }
}