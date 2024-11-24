import { AuthorsListPageComponent } from './pages/authors/authors-list-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BooksRoutingModule } from './books-routing.module';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { BooksListPageComponent } from './pages/books/books-list-page.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DeleteEntityComponent } from './components/data-table/delete-entity/delete-entity.component';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule  } from 'primeng/toolbar';
import { CardModule  } from 'primeng/card';
import { PanelMenuModule  } from 'primeng/panelmenu';
import { CreateEntityComponent } from './components/data-table/create-entity/create-entity.component';
import { EditEntityComponent } from './components/data-table/edit-entity/edit-entity.component';
import { LoansListPageComponent } from './pages/loans/loans-list-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';

@NgModule({
  declarations: [
    CreateEntityComponent,
    EditEntityComponent,
    DeleteEntityComponent,
    LayoutPageComponent,
    BooksListPageComponent,
    AuthorsListPageComponent,
    LoansListPageComponent,
    DashboardPageComponent,
    DataTableComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    PanelMenuModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ToastModule
  ]
})
export class BooksModule { }
