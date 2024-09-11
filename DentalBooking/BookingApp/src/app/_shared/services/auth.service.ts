import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "http://imarkden-001-site1.itempurl.com/api/";
  // private baseUrl: string = "https://localhost:7158/api/";
  private userPayload: any;
  constructor(private http: HttpClient, private router: Router) {
    // this.userPayload = this.decodeToken
   }

  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}admin/register`, userObj);
  }

  login(loginObj: any){
    return this.http.post<any>(`${this.baseUrl}admin/auth`, loginObj);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['']);
    
  }

  setToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }

  setRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }

  // decodeToken(){
  //   const jwtHelper = new JwtHelperService();
  //   const token = this.getToken()!;
  //   console.log(jwtHelper.decodeToken(token))
  //   return jwtHelper.decodeToken(token)
  // }

  // getFullNameFromToken(){
  //   if(this.userPayload)
  //   return this.userPayload.name;
  // }

  // getRoleFromToken(){
  //   if(this.userPayload)
  //   return this.userPayload.role;
  // }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(`${this.baseUrl}admin/refresh`, tokenApi)
  }

  resetPassword(url: string): Observable<any> {
    return this.http.post(url, {});
  }

  verifyOTPAndResetPassword(username: string, otp: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}admin/reset-password/verify-otp?username=${username}&otp=${otp}&newPassword=${newPassword}`;
    return this.http.post(url, {});
  }
}
