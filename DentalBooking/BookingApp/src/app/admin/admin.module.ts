import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AdminComponent } from './admin.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { GuestComponent } from './components/guest/guest.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { PatientsComponent } from './components/patients/patients.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ServicePatientListModalComponent } from './components/service-patient-list-modal/service-patient-list-modal.component';
import { ServiceBookListModalComponent } from './components/service-book-list-modal/service-book-list-modal.component';


@NgModule({
  declarations: [
    AdminComponent,
    GuestComponent,
    DoctorComponent,
    ServiceListComponent,
    PatientsComponent,
    ReportsComponent,
    ServicePatientListModalComponent,
    ServiceBookListModalComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    NgbActiveModal
  ]
})
export class AdminModule { }
