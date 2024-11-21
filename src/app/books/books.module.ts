import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BooksRoutingModule } from './books-routing.module';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DeleteEntityComponent } from './components/data-table/delete-entity/delete-entity.component';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule  } from 'primeng/toolbar';
import { PanelMenuModule  } from 'primeng/panelmenu';
import { CreateEntityComponent } from './components/data-table/create-entity/create-entity.component';

@NgModule({
  declarations: [
    CreateEntityComponent,
    DeleteEntityComponent,
    LayoutPageComponent,
    ListPageComponent,
    DataTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    PanelMenuModule,
    ToolbarModule,
    ButtonModule,  // Módulo para usar botones
    DialogModule,  // Módulo para usar diálogos (modales)
    ToastModule    // Módulo para usar notificaciones (opcional)
  ]
})
export class BooksModule { }
