import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Router, NavigationEnd } from '@angular/router';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockRouter: Partial<Router>; // Using Partial<Router> for easier mocking

  const mockCartItems = [
    { productId: 1, name: 'Product 1', price: 100, quantity: 1, subtotal: 100, selected: false },
    { productId: 2, name: 'Product 2', price: 200, quantity: 2, subtotal: 400, selected: false },
  ];

  const mockOrders: Order[] = [
    { id: 1, date: '2023.01.01', quantity: 2, total: 300 },
    { id: 2, date: '2023.01.02', quantity: 1, total: 100 },
  ];

  beforeEach(async () => {
    // Create mock services
    mockCartService = jasmine.createSpyObj(
      'CartService',
      ['getCart', 'removeFromCart', 'updateProductQuantity', 'isProductInCart'],
      {
        currentCartQuantity: new BehaviorSubject<number>(0),
      }
    );

    mockOrderService = jasmine.createSpyObj('OrderService', ['getOrders', 'addOrder']);

    // Properly mock Router with all required properties
    mockRouter = {
      events: of(new NavigationEnd(1, '/cart', '/cart')),
      url: '/cart',
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    // Setup mock responses
    mockCartService.getCart.and.returnValue(of(mockCartItems));
    mockOrderService.getOrders.and.returnValue(of(mockOrders));
    mockCartService.isProductInCart.and.returnValue(true);
    mockCartService.removeFromCart.and.returnValue(of({}));
    mockCartService.updateProductQuantity.and.returnValue(of({}));
    mockOrderService.addOrder.and.returnValue(
      of({
        id: 3,
        date: '2023.01.03',
        quantity: 2,
        total: 500,
      } as Order)
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items and orders on init', () => {
    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(mockOrderService.getOrders).toHaveBeenCalled();
    expect(component.cartItems.length).toBe(2);
    expect(component.orders.length).toBe(2);
  });

  it('should calculate total correctly', () => {
    expect(component.total).toBe(500);
  });

  it('should toggle select all items', () => {
    component.selectAllChecked = true;
    component.toggleSelectAll();
    expect(component.cartItems.every((item) => item.selected)).toBeTrue();

    component.selectAllChecked = false;
    component.toggleSelectAll();
    expect(component.cartItems.every((item) => !item.selected)).toBeTrue();
  });

  it('should remove selected item', () => {
    component.selectedProduct = { id: 1 } as Product;
    component.removeItem();
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should increase quantity', () => {
    const product = mockCartItems[0];
    component.increaseQuantity(product);
    expect(mockCartService.updateProductQuantity).toHaveBeenCalledWith(
      product.productId,
      1,
      'increase',
      product.price
    );
  });

  it('should decrease quantity', () => {
    const product = mockCartItems[0];
    component.decreaseQuantity(product);
    expect(mockCartService.updateProductQuantity).toHaveBeenCalledWith(
      product.productId,
      1,
      'decrease',
      product.price
    );
  });

  it('should create new order and clear cart', () => {
    const today = new Date();
    const expectedDate = today.toISOString().split('T')[0].replaceAll('-', '.');

    component.addOrder();

    expect(mockOrderService.addOrder).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 3,
        date: expectedDate,
        quantity: 2,
        total: 500,
      })
    );

    expect(component.orderNumber).toBe('3');
    expect(component.showOrderModal).toBeTrue();
  });

  it('should navigate to home', () => {
    component.goToHome();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  it('should navigate to catalog', () => {
    component.goToCatalog();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/catalog');
  });
  it('should handle empty cart', () => {
    mockCartService.getCart.and.returnValue(of([]));
    component.loadCart();
    fixture.detectChanges();

    expect(component.cartItems.length).toBe(0);
    expect(component.total).toBe(0);
  });

  it('should not remove item when no product is selected', () => {
    component.selectedProduct = null;
    component.removeItem();
    expect(mockCartService.removeFromCart).not.toHaveBeenCalled();
  });

  it('should not update quantity for product not in cart', () => {
    mockCartService.isProductInCart.and.returnValue(false);
    const product = mockCartItems[0];

    component.increaseQuantity(product);
    expect(mockCartService.updateProductQuantity).not.toHaveBeenCalled();

    component.decreaseQuantity(product);
    expect(mockCartService.updateProductQuantity).not.toHaveBeenCalled();
  });

  it('should handle error when loading cart fails', () => {
    mockCartService.getCart.and.returnValue(throwError(() => new Error('Failed')));
    component.loadCart();
    expect(component.cartItems).toEqual([]);
  });

  it('should handle first order creation when no orders exist', () => {
    mockOrderService.getOrders.and.returnValue(of([]));
    component.loadOrders();
    fixture.detectChanges();

    component.addOrder();

    expect(mockOrderService.addOrder).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 1,
        quantity: 2,
      })
    );
  });

  it('should not remove all items when none are selected', () => {
    component.cartItems.forEach((item) => (item.selected = false));
    component.removeAllSelectedItems();
    expect(mockCartService.removeFromCart).not.toHaveBeenCalled();
  });

  it('should handle quantity decrease to zero', () => {
    const product = { ...mockCartItems[0], quantity: 1 };
    component.decreaseQuantity(product);
    expect(mockCartService.updateProductQuantity).toHaveBeenCalledWith(
      product.productId,
      1,
      'decrease',
      product.price
    );
  });

  it('should handle payment method change', () => {
    const mockEvent = { target: { value: 'new_value' } } as unknown as Event;
    component.onChangePaymentMethod(mockEvent);
    expect(component.selectedPaymentMethod).toBe('new_value');
  });

  it('should handle tab selection', () => {
    component.selectTab('orders');
    expect(component.selectedTab).toBe('orders');
  });

  it('should initialize with first payment method selected', () => {
    expect(component.selectedPaymentMethod).toBe(component.paymentMethods[0].value);
  });
});
