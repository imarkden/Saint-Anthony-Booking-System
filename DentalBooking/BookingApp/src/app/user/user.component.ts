import { Component } from '@angular/core';
import { AuthService } from '../_shared/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  isHome = false;
  isAbout = false;
  isServices = false;
  isBook = false;

  constructor (private auth: AuthService) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isActiveHome(): void {
    this.isHome = true;
    this.isAbout = false;
    this.isServices = false;
    this.isBook = false;

  }

  isActiveAbout(): void {
    this.isAbout = true;
    this.isHome = false;
    this.isServices = false;
    this.isBook = false;
  }
  
  isActiveServices(): void {
    this.isServices = true;
    this.isHome = false;
    this.isAbout = false;
    this.isBook = false;

  }

  isActiveBook(): void {
    this.isBook = true;
    this.isServices = false;
    this.isHome = false;
    this.isAbout = false;
  }
}
