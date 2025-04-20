import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  public apiUrl = 'http://localhost:8080/api/order';
  public constructor(private http: HttpClient) {}

  public getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
  public addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }
}
