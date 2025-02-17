import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })

export class OrderService {
  private apiUrl = 'http://localhost:8080/api/order';
  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
  addOrder(order: Order): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }
}
