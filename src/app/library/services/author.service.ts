import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Author } from '../model/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private readonly baseUrl: string = environments.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.get<any>(`${this.baseUrl}/authors`);
  }
}
