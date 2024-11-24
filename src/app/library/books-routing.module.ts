import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { BooksListPageComponent } from './pages/books/books-list-page.component';
import { NgModule } from '@angular/core';
import { AuthorsListPageComponent } from './pages/authors/authors-list-page.component';
import { LoansListPageComponent } from './pages/loans/loans-list-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'books', component: BooksListPageComponent },
      { path: 'authors', component: AuthorsListPageComponent },
      { path: 'loans', component: LoansListPageComponent },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: '**', redirectTo: 'books' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
