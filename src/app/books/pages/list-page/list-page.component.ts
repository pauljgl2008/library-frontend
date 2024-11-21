import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { PaginatedBooksResponse } from '../../model/book';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../model/author';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: []
})
export class ListPageComponent implements OnInit {

  data: any;
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
  authors: any[] = [];  // Agregar los autores aquí

  newBook: any = {
    title: null,
    author: null,
    isbn: null,
    publication_date: null,
    status: 'Disponible'  // Valor por defecto, puede ser "Disponible" o "No disponible"
  };
  constructor(private bookService: BookService, private authorSerivce: AuthorService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();  // Cargar los autores cuando la página se inicia
  }
  loadAuthors(): void {
    this.authorSerivce.getAuthors()
      .subscribe((response: any) => {
        console.log("getAuthors")
        console.log(response)
        this.authors = response
      });
  }

  loadBooks(): void {
    this.bookService.getPaginatedBooks(this.pageIndex, this.pageSize)
      .subscribe((books: PaginatedBooksResponse) => {
        this.data = books.content;
        this.pageIndex = books.pageable.pageNumber;
        this.pageSize = books.pageable.pageSize;
        this.totalPages = books.totalPages;

        if (this.data.length === 0 && this.pageIndex > 0) {
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
    console.log("onEdit")
    console.log(item)
  }

  onDelete(item: any): void {
    console.log("onDelete")
    console.log(item)
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
      status: 'Disponible' // Valor por defecto
    };
    this.visible = true;
  }

  // Recibir el libro guardado desde el componente hijo
  onSaveItem(item: any): void {
    this.bookService.addBook(item).subscribe((response) => {
      console.log('Libro creado:', response);
      this.loadBooks();
      this.visible = false; // Cerrar el modal
    });
  }

  onCancelCreate(): void {
    this.visible = false;  // Cerrar el modal sin guardar
  }
}
