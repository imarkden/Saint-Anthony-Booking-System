import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string="http://imarkden-001-site1.itempurl.com/admin/"

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.baseUrl);
  }
}
