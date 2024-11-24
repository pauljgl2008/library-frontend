import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { EntityField } from '../../model/entityField';
import { BookResponseDto } from '../../model/book-response-dto';

@Component({
  selector: 'app-authors-list-page',
  templateUrl: './authors-list-page.component.html',
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
    { header: 'Nombre', field: 'name' },
    { header: 'Nacionalidad', field: 'nationality' },
    { header: 'Fecha de nacimiento', field: 'birth_date' },
    { header: 'Acciones', field: 'actions' },
  ];
  entityFields: EntityField[] = [
    { field: 'name', label: 'Nombre', type: 'text' },
    { field: 'nationality', label: 'Nacionalidad', type: 'text' },
    { field: 'birth_date', label: 'Fecha de nacimiento', type: 'date' },
  ];
  authors: any;
  newBook: any = {
    name: null,
    nationality: null,
    birth_date: null,
  };

  constructor(private readonly authorSerivce: AuthorService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorSerivce.getAuthors().subscribe((response: any) => {
      this.authors = response;
    });
  }

  onEdit(item: any): void {
    this.updateAuthor(item);
  }

  updateAuthor(item: any) {
    this.authorSerivce.updateAuthor(item.id, item).subscribe({
      next: (response: BookResponseDto) => {
        console.log('Autor actualizado:', response);
        this.loadAuthors();
      },
      error: (error) => {
        console.error('Error al actualizar el autor:', error);
      },
    });
  }

  onDelete(item: any): void {
    this.authorSerivce.deleteAuthor(item.id).subscribe(() => {
      this.loadAuthors();
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
    this.authorSerivce.addAuthor(item).subscribe((response) => {
      console.log('Autor creado:', response);
      this.loadAuthors();
      this.visible = false;
    });
  }

  onCancelCreate(): void {
    this.visible = false;
  }
}
