import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbTimepickerModule } from '@nebular/theme';
import { NbInputModule, NbCalendarRangeModule, NbFormFieldModule } from '@nebular/theme';
import { NbThemeModule } from '@nebular/theme';


import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './components/home/home.component';
import { BookNowComponent } from './components/book-now/book-now.component';
import { AboutComponent } from './components/about/about.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { UserComponent } from './user.component';
import { ServicesComponent } from './components/services/services.component';

@NgModule({
  declarations: [
    UserComponent,
    AboutComponent,
    BookNowComponent,
    ServicesComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRoutingModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NbTimepickerModule.forRoot(),
    NbCalendarRangeModule,
    NbThemeModule.forRoot(),
    NbInputModule,
    NbFormFieldModule
  ]
})
export class UserModule { }
