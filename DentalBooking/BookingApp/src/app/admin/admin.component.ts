import { Component } from '@angular/core';
import { AuthService } from '../_shared/services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(private auth: AuthService,
    private toast: NgToastService){}
  logout(){
    this.auth.logout();
    this.toast.warning({detail: "Logged Out", summary: "You have logged out", duration: 3000})
  }

}
