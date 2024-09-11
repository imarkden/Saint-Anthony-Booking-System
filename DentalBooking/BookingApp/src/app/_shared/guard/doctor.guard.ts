import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorGuard implements CanActivate {

  constructor(private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if the user is authenticated
    if (this.isLoggedIn()) {
      return true; // Allow access to the route
    } else {
      // If not authenticated, redirect to the login page
      this.router.navigate(['doctor-login']);
      return false;
    }
  }

  isLoggedIn(): boolean {
    // Add your authentication logic here
    // For example, check if the user is logged in by verifying authentication tokens or session information
    // Return true if the user is authenticated, otherwise false
    return true; // Placeholder value, replace with your actual authentication logic
  }
}
