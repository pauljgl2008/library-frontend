import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedBooksResponse } from '../model/book';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly baseUrl: string = environments.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getPaginatedBooks(
    page: number,
    size: number
  ): Observable<PaginatedBooksResponse> {
    return this.http.get<PaginatedBooksResponse>(
      `${this.baseUrl}/books?page=${page}&size=${size}`
    );
  }

  addBook(book: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/books`, book);
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/books/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }
}
