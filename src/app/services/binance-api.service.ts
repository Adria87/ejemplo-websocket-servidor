import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeInfo } from '../models/binance/exchange-info';

const baseUrl = 'https://api.binance.com';

@Injectable({
  providedIn: 'root'
})
export class BinanceApiService {

  constructor(private http: HttpClient) { }

  getExchangeInfo(): Observable<ExchangeInfo> {
    return this.http.get(`${baseUrl}/api/v3/exchangeInfo`);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}`, data);
  }

}
