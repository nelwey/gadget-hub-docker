import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

interface CartItem {
  productId: number;
  quantity: number;
}

interface ApiCartItem {
  id: number;
  quantity: number;
  price: number;
  src: string;
  title: string;
}

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let cartQuantitySubject: BehaviorSubject<number>;

  const mockUserId = 'user-123';
  const mockCartItems: CartItem[] = [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ];
  const mockApiResponse: ApiCartItem[] = [
    { id: 1, quantity: 2, price: 10, src: 'image1.jpg', title: 'Product 1' },
    { id: 2, quantity: 1, price: 20, src: 'image2.jpg', title: 'Product 2' },
  ];

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['getUserId']);
    mockAuthService.getUserId.and.returnValue(mockUserId);

    cartQuantitySubject = new BehaviorSubject<number>(0);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService, { provide: AuthService, useValue: mockAuthService }],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);

    (service as any).cartQuantitySource = cartQuantitySubject;
    spyOn((service as any).cartQuantitySource, 'next').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCart()', () => {
    it('should fetch cart items for current user', () => {
      service.getCart().subscribe((items) => {
        expect(items).toEqual(mockApiResponse);
      });

      const req = httpMock.expectOne(`${service.apiUrl}/${mockUserId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });
  });

  describe('addToCart()', () => {
    it('should add item to cart and update quantity', () => {
      const productId = 3;
      const quantity = 1;
      const price = 30;
      const src = 'image3.jpg';
      const title = 'Product 3';

      service.addToCart(productId, quantity, price, src, title).subscribe();

      const req = httpMock.expectOne(`${service.apiUrl}/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        userId: mockUserId,
        productId,
        quantity,
        price,
        subtotal: 0,
        src,
        title,
      });
      req.flush({});

      const cart = (service as any).cart as CartItem[];
      expect(cart).toContain(jasmine.objectContaining({ productId, quantity }));
      expect((service as any).cartQuantitySource.next).toHaveBeenCalledWith(1);
    });
  });

  describe('removeFromCart()', () => {
    beforeEach(() => {
      (service as any).cart = [...mockCartItems];
      cartQuantitySubject.next(3);
    });

    it('should remove item from cart and update quantity', () => {
      const productIdToRemove = 1;

      service.removeFromCart(productIdToRemove).subscribe();

      const req = httpMock.expectOne(`${service.apiUrl}/delete/${mockUserId}/${productIdToRemove}`);
      req.flush({});

      const cart = (service as any).cart as CartItem[];
      expect(cart.some((item: CartItem) => item.productId === productIdToRemove)).toBeFalse();
      expect((service as any).cartQuantitySource.next).toHaveBeenCalledWith(1);
    });
  });

  describe('isProductInCart()', () => {
    beforeEach(() => {
      (service as any).cart = [...mockCartItems];
    });

    it('should return true if product is in cart', () => {
      expect(service.isProductInCart(1)).toBeTrue();
    });
  });

  describe('updateProductQuantity()', () => {
    beforeEach(() => {
      (service as any).cart = [...mockCartItems];
      cartQuantitySubject.next(3);
    });

    it('should increase product quantity', () => {
      const productId = 1;

      service.updateProductQuantity(productId, 1, 'increase', 10).subscribe();

      const req = httpMock.expectOne(`${service.apiUrl}/update/${productId}`);
      req.flush({});

      const cart = (service as any).cart as CartItem[];
      const product = cart.find((p: CartItem) => p.productId === productId);
      expect(product?.quantity).toBe(3); // 2 + 1
      expect((service as any).cartQuantitySource.next).toHaveBeenCalledWith(4); // 3 + 1
    });
  });

  describe('updateCartQuantityTotal()', () => {
    it('should calculate total quantity correctly', () => {
      (service as any).cart = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
        { productId: 3, quantity: 1 },
      ];

      service.updateCartQuantityTotal();

      expect((service as any).cartQuantitySource.next).toHaveBeenCalledWith(6);
    });
  });

  describe('clearCart()', () => {
    it('should empty the cart and reset quantity', () => {
      (service as any).cart = [...mockCartItems];
      cartQuantitySubject.next(3);

      service.clearCart();

      expect((service as any).cart).toEqual([]);
      expect((service as any).cartQuantitySource.next).toHaveBeenCalledWith(0);
    });
  });
});
