import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })

export class CartService {
  constructor(private http: HttpClient, private authService: AuthService) { }
  private apiUrl = 'http://localhost:8080/api/cart';
  private cart: { productId: number, quantity: number }[] = [];

  private cartQuantitySource = new BehaviorSubject<number>(0);
  currentCartQuantity = this.cartQuantitySource.asObservable();

  getCart(): Observable<any[]> {
    let userId = this.authService.getUserId();
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
  addToCart(productId: number, quantity: number, price: number, src: string, title: string): Observable<any> {
    let userId = this.authService.getUserId();
    const newCartItem = { productId, quantity };
    this.cart.push(newCartItem);
    let updatedQuantity = this.cartQuantitySource.value + 1;
    this.cartQuantitySource.next(updatedQuantity);
    return this.http.post(`${this.apiUrl}/add`, { userId, productId, quantity, price, subtotal: 0, src, title });
  }

  removeFromCart(productId: number): Observable<any> {
    let userId = this.authService.getUserId();
    this.cart = this.cart.filter(product => product.productId !== productId);
    this.updateCartQuantityTotal();
    return this.http.delete(`${this.apiUrl}/delete/${userId}/${productId}`);
  }

  isProductInCart(productId: number): boolean {
    return this.cart.some(item => item.productId === productId);
  }

  updateProductQuantity(productId: number, quantity: number, action: string, price: number): Observable<any> {
    const product = this.cart.find(p => p.productId === productId);
    if (action === "increase") {
      product!.quantity++;
      this.updateCartQuantityTotal();
    }
    if (action === "decrease") {
      if (product && product.quantity > 0) {
        product!.quantity--;
        this.updateCartQuantityTotal();
      } if (product && product.quantity === 0) {
        this.removeFromCart(productId);
      }
    }

    return this.http.put(`${this.apiUrl}/update/${productId}`, { quantity, action, price });
  }
  updateCartQuantityTotal(): void {
    let updatedQuantity = this.cartQuantitySource.value;
    updatedQuantity = this.cart.reduce((total, product) => total + product.quantity, 0);
    this.cartQuantitySource.next(updatedQuantity);
  }
  loadCart(): void {
    this.getCart().subscribe(cartItems => {
      this.cart = cartItems.map(item => ({ productId: item.id, quantity: item.quantity }));
      this.updateCartQuantityTotal();
    });
  }
  clearCart(): void {
    this.cart = [];
    this.updateCartQuantityTotal();
  }
}
