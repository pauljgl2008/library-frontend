import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
