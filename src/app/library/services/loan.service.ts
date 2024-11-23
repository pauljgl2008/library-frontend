import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';
import { Loan } from '../model/loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly baseUrl: string = environments.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getLoans(): Observable<Loan[]> {
    return this.http.get<any>(`${this.baseUrl}/loans`);
  }

  addLoan(loan: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/loans`, loan);
  }

  updateLoan(id: number, loan: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/loans/${id}`, loan);
  }

  deleteLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/loans/${id}`);
  }
}
