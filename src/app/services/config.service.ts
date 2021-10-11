import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';
import { Config } from '../models/config.model';

const baseUrl = 'http://localhost:8080/api/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  get(): Observable<Config> {
    return this.http.get(`${baseUrl}`);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}`, data);
  }

}
