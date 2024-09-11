import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { DoctorLoggedComponent } from './doctor.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: 'doctor/:username', component: DoctorLoggedComponent,
        children: [
          { path: '', component: DashboardComponent },
          { path: 'dashboard', component: DashboardComponent},
          { path: 'patients', component: PatientsComponent },
          { path: 'profile', component: ProfileComponent },
        ]
      } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
