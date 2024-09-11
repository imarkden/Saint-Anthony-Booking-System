import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { BookNowComponent } from './components/book-now/book-now.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';

const routes: Routes = [
    {
        path: '', component: UserComponent,
        children: [
        { path: '', component: HomeComponent },
        { path: 'book-now', component: BookNowComponent},
        { path: 'about', component: AboutComponent},
        { path: 'services', component: ServicesComponent}
      ]
    }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }
