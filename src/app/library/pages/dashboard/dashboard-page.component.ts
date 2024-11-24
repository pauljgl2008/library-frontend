import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  books: any;
  authors: any;
  loans: any;

  constructor(
    private readonly bookService: BookService,
    private readonly authorSerivce: AuthorService,
    private readonly loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
    this.loadLoans();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe((response: any) => {
      this.books = response.length;
    });
  }

  loadAuthors(): void {
    this.authorSerivce.getAuthors().subscribe((response: any) => {
      this.authors = response.length;
    });
  }

  loadLoans(): void {
    this.loanService.getLoans().subscribe((response: any) => {
      this.loans = response.length;
      console.log(this.loans);
    });
  }
}
