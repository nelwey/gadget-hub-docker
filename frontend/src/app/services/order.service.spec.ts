import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Order } from '../models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockOrders: Order[] = [
    { id: 1, date: '2023.01.01', quantity: 2, total: 100 },
    { id: 2, date: '2023.01.02', quantity: 1, total: 50 },
  ];

  const newOrder: Order = {
    id: 3,
    date: '2023.01.03',
    quantity: 3,
    total: 150,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrders()', () => {
    it('should fetch all orders', () => {
      service.getOrders().subscribe((orders) => {
        expect(orders).toEqual(mockOrders);
        expect(orders.length).toBe(2);
      });

      const req = httpMock.expectOne(service.apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders);
    });

    it('should handle empty response', () => {
      service.getOrders().subscribe((orders) => {
        expect(orders).toEqual([]);
      });

      const req = httpMock.expectOne(service.apiUrl);
      req.flush([]);
    });

    it('should handle errors', () => {
      service.getOrders().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(service.apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('addOrder()', () => {
    it('should add a new order', () => {
      service.addOrder(newOrder).subscribe((order) => {
        expect(order).toEqual(newOrder);
      });

      const req = httpMock.expectOne(service.apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newOrder);
      req.flush(newOrder);
    });

    it('should handle validation errors', () => {
      const invalidOrder = { ...newOrder, total: -10 };

      service.addOrder(invalidOrder).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(service.apiUrl);
      req.flush('Invalid total', { status: 400, statusText: 'Bad Request' });
    });

    it('should require all mandatory fields', () => {
      const incompleteOrder = { date: '2023.01.04' } as Order;

      service.addOrder(incompleteOrder).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne(service.apiUrl);
      req.flush({ error: 'Missing required fields' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('API URL', () => {
    it('should have correct API endpoint', () => {
      expect(service.apiUrl).toBe('http://localhost:8080/api/order');
    });
  });
});
