import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      color: 'red',
      category: 'Smartphones',
      src: 'image1.jpg',
      description: 'Description 1',
      rating: '4.5',
    },
    {
      id: 2,
      title: 'Product 2',
      price: 200,
      color: 'blue',
      category: 'Laptops',
      src: 'image2.jpg',
      description: 'Description 2',
      rating: '4.8',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts()', () => {
    it('should return an observable of products', () => {
      service.getProducts().subscribe((products) => {
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
      });

      const req = httpMock.expectOne(service.apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle empty product list', () => {
      service.getProducts().subscribe((products) => {
        expect(products).toEqual([]);
      });

      const req = httpMock.expectOne(service.apiUrl);
      req.flush([]);
    });

    it('should handle server errors', () => {
      service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      const req = httpMock.expectOne(service.apiUrl);
      req.flush('Server error', {
        status: 500,
        statusText: 'Server Error',
      });
    });
  });

  describe('API Configuration', () => {
    it('should use the correct API endpoint', () => {
      expect(service.apiUrl).toBe('http://localhost:8080/api/product');
    });
  });
});
