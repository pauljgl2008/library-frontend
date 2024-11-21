import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedBooksResponse } from '../model/book';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  // Método para obtener los libros paginados
  getPaginatedBooks(page: number, size: number): Observable<PaginatedBooksResponse> {
    return this.http.get<PaginatedBooksResponse>(`${this.baseUrl}/books?page=${page}&size=${size}`);
  }
  addBook( book: any ): Observable<any> {
    return this.http.post<any>(`${ this.baseUrl }/books`, book );
  }
  // Método para eliminar un libro por su ID
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }
}
