import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guest } from '../../_shared/models/guest.model'

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private apiBaseUrl = 'http://imarkden-001-site1.itempurl.com/api/';

  constructor(private readonly http: HttpClient) {}

  getAllGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests`;
    return this.http.get<Guest[]>(url);
  }

  getGuestById(id: number): Observable<Guest> {
    const url = `${this.apiBaseUrl}guests/${id}`;
    return this.http.get<Guest>(url);
  }

  createGuest(guest: Guest): Observable<Guest> {
    const url = `${this.apiBaseUrl}guests`;
    return this.http.post<Guest>(url, guest);
  }

  updateGuest(id: number, guest: Guest): Observable<any> {
    const url = `${this.apiBaseUrl}guests/${id}`;
    return this.http.put(url, guest);
  }

  getSuccessGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/success`;
    return this.http.get<Guest[]>(url);
  }

  getOngoingGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/ongoing`;
    return this.http.get<Guest[]>(url);
  }

  getPendingGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/pending`;
    return this.http.get<Guest[]>(url);
  }

  getCancelGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/cancel`;
    return this.http.get<Guest[]>(url);
  }

  getFailGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/fail`;
    return this.http.get<Guest[]>(url);
  }

  getTodayGuests(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/today`;
    return this.http.get<Guest[]>(url);
  }

  getGuestHistory(): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/history`;
    return this.http.get<Guest[]>(url);
  }

  getGuestsByYear(year: number): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/year/${year}`;
    return this.http.get<Guest[]>(url);
  }

  getGuestsByYearAndMonth(year: number, month: number): Observable<Guest[]> {
    const url = `${this.apiBaseUrl}guests/year/${year}/month/${month}`;
    return this.http.get<Guest[]>(url);
  }


  deleteGuest(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}guests/${id}`)
  }

  updateGuestStatusSuccess(id: number): Observable<any> {
    const url = `${this.apiBaseUrl}guests/${id}/status-success`;
    return this.http.put(url, {});
  }

  updateGuestStatusConfirm(id: number): Observable<any> {
    const url = `${this.apiBaseUrl}guests/${id}/status-confirm`;
    return this.http.put(url, {});
  }

  updateGuestStatusCancel(id: number): Observable<any> {
    const url = `${this.apiBaseUrl}guests/${id}/status-cancel`;
    return this.http.put(url, {});
  }
}
