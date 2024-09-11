import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../models/service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl = 'http://imarkden-001-site1.itempurl.com/api/service';

  constructor(private http: HttpClient) { }

  getAllServicess(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}`);
  }

  getServicesId(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/${id}`);
  }

  createService(service: any): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}`, service);
  }

  updateService(id: number, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}