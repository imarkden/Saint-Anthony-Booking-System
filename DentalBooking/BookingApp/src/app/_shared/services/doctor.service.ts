import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';
import { HttpClient } from '@angular/common/http';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = 'http://imarkden-001-site1.itempurl.com/api/doctor';
  // private baseUrl = 'https://localhost:7158/api/doctor';

  constructor(private http: HttpClient) { }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  createDoctor(doctor: any): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}`, doctor);
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  login(loginModel: LoginModel): Observable<Doctor> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<Doctor>(url, loginModel);
  }

  getDoctorByUsername(username: string): Observable<Doctor> {
    const url = `${this.baseUrl}/username/${username}`;
    return this.http.get<Doctor>(url);
  }
  
}