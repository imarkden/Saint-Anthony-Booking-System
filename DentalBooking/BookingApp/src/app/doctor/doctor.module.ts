import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NbThemeModule } from '@nebular/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { DoctorLoggedComponent } from './doctor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgToastModule } from 'ng-angular-popup';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { RouterModule } from '@angular/router';
import { DoctorRoutingModule } from './doctor-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { DoctorGuard } from '../_shared/guard/doctor.guard';



@NgModule({
  declarations: [
    DashboardComponent,
    PatientsComponent,
    ProfileComponent,
    DoctorLoggedComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    FormsModule,
    NbThemeModule,
    RouterModule,
    DoctorRoutingModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [
    NgbActiveModal,
    DoctorGuard
  ]
})
export class DoctorModule { }
