import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guest } from '../models/guest.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookNowService {

  private apiUrl = 'http://imarkden-001-site1.itempurl.com/guests';

  constructor(private http: HttpClient) { }

  createGuest(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(`${this.apiUrl}/create`, guest);
  }

  generateOtp(id: number, phoneNumber: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${id}/otp${phoneNumber}`, {});
  }

  getGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${this.apiUrl}`);
  }

  getSuccessGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${this.apiUrl}/success`);
  }

  getOngoingGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${this.apiUrl}/ongoing`);
  }

  getCancelGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${this.apiUrl}/cancel`);
  }

  getFailGuests(): Observable<Guest[]> {
    return this.http.get<Guest[]>(`${this.apiUrl}/fail`);
  }
}