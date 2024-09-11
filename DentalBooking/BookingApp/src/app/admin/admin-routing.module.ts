import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from '../_shared/guard/auth.guard';
import { GuestComponent } from './components/guest/guest.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { PatientsComponent } from './components/patients/patients.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
    {
        path: 'admin', component: AdminComponent, canActivate: [AuthGuard],//
        children: [
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
        { path: 'book-list', component: GuestComponent, canActivate: [AuthGuard] },
        { path: 'doctors', component: DoctorComponent, canActivate: [AuthGuard]},
        { path: 'services', component: ServiceListComponent, canActivate: [AuthGuard]},
        { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard]},
        { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]}

      ]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
