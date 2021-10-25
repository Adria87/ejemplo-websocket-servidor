import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TradePanel } from '../models/trade-panel.model';

const baseUrl = 'http://localhost:8080/api/trade-panel';

@Injectable({
  providedIn: 'root'
})
export class TradePanelService {

  constructor(private http: HttpClient) { }

  get(): Observable<TradePanel> {
    return this.http.get(`${baseUrl}`);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}`, data);
  }

}
