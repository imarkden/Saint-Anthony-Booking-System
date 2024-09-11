import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiBaseUrl = 'http://imarkden-001-site1.itempurl.com/api/';

  constructor(private readonly http: HttpClient) { }

  getAllPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment`;
    return this.http.get<Patient[]>(url);
  }

  getPatientById(id: number): Observable<Patient> {
    const url = `${this.apiBaseUrl}appointment/${id}`;
    return this.http.get<Patient>(url);
  }

  createPatient(patient: Patient): Observable<Patient> {
    const url = `${this.apiBaseUrl}appointment`;
    return this.http.post<Patient>(url, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<any> {
    const url = `${this.apiBaseUrl}appointment/${id}`;
    return this.http.put(url, patient);
  }

  getSuccessPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/success`;
    return this.http.get<Patient[]>(url);
  }

  getOngoingPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/ongoing`;
    return this.http.get<Patient[]>(url);
  }

  getPendingPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/pending`;
    return this.http.get<Patient[]>(url);
  }

  getCancelPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/cancel`;
    return this.http.get<Patient[]>(url);
  }

  getFailPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/fail`;
    return this.http.get<Patient[]>(url);
  }

  getTodayPatients(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/today`;
    return this.http.get<Patient[]>(url);
  }

  getPatientsHistory(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/history`;
    return this.http.get<Patient[]>(url);
  }

  getUnsuccessfulPatient(): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/unsuccessful`;
    return this.http.get<Patient[]>(url);
  }

  getAppointmentsByYearAndMonth(year: number, month: number): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/year/${year}/month/${month}`;
    return this.http.get<Patient[]>(url);
  }

  getAppointmentsByYear(year: number): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/year/${year}`;
    return this.http.get<Patient[]>(url);
  }

  getPatientsByYearAndMonthAndStatus(year: number, month: number, status: string): Observable<Patient[]> {
    const url = `${this.apiBaseUrl}appointment/status/${status}/year/${year}/month/${month}`;
    return this.http.get<Patient[]>(url);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}appointment/${id}`)
  }

  updatePatientStatusSuccess(id: number): Observable<any> {
    const url = `${this.apiBaseUrl}appointment/${id}/status-success`;
    return this.http.put(url, {});
  }

  updatePatientStatusConfirm(id: number): Observable<any> {
    const url = `${this.apiBaseUrl}appointment/${id}/status-confirm`;
    return this.http.put(url, {});
  }

  updatePatientStatusCancel(id: number): Observable<any> {
    const url = `${this.apiBaseUrl}appointment/${id}/status-cancel`;
    return this.http.put(url, {});
  }
}
