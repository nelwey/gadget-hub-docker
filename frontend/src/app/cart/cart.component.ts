import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private router: Router,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadOrders();
  }

  public cartItems: any[] = [];
  public orders: Order[] = [];
  public selectedTab = 'cart';
  public selectedProduct: Product | null = null;

  public paymentMethods = [
    { value: 'value 2', label: 'value 1' },
    { value: 'value 1', label: 'value 2' },
  ];
  public selectedPaymentMethod: string = this.paymentMethods[0].value;

  public selectedTypeOrder = 'Самовывоз';

  public showOrderModal = false;
  public selectAllChecked = false;

  public orderNumber = '';

  toggleSelectAll(): void {
    this.cartItems.forEach(
      (product) => (product.selected = this.selectAllChecked),
    );
  }

  onChangePaymentMethod(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPaymentMethod = target.value;
  }

  openOrderModal(): void {
    this.showOrderModal = true;
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
  }
  openModal(product: any): void {
    this.selectedProduct = product;
    if (this.selectedProduct) {
      this.selectedProduct.id = product.productId;
    }
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items.map((item) => ({ ...item, selected: false }));
      },
      error: (err) => console.error(err),
    });
  }
  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => console.error(err),
    });
  }
  get total(): number {
    let total = 0;
    this.cartItems.forEach((product) => {
      total += product.subtotal;
    });
    return total;
  }

  removeItem(): void {
    if (this.selectedProduct) {
      this.cartService.removeFromCart(this.selectedProduct.id).subscribe({
        next: () => {
          this.loadCart();
          this.closeModal();
        },
        error: (err) => console.error(err),
      });
    }
  }
  removeAllSelectedItems(): void {
    const selectedProducts = this.cartItems.filter(
      (product) => product.selected,
    );

    if (selectedProducts.length > 0) {
      selectedProducts.forEach((product) => {
        this.cartService.removeFromCart(product.id).subscribe({
          next: () => {
            console.log(`Product with ID ${product.id} removed from cart.`);
            this.loadCart();
          },
          error: (err) =>
            console.error('Error removing product from cart:', err),
        });
      });
      this.cartItems = [];
    }
  }
  removeAllItems(): void {
    this.cartItems.forEach((item) => {
      this.cartService.removeFromCart(item.productId).subscribe({
        next: () => {
          this.ngOnInit();
        },
        error: (err) => console.error('Error removing product from cart:', err),
      });
    });
  }

  increaseQuantity(product: any): void {
    if (product && this.isInCart(product)) {
      this.updateCartQuantity(product, 1, 'increase');
    }
  }

  decreaseQuantity(product: any): void {
    if (product && this.isInCart(product)) {
      this.updateCartQuantity(product, 1, 'decrease');
    }
  }
  isInCart(product: any): boolean {
    return this.cartService.isProductInCart(product.productId);
  }
  updateCartQuantity(product: any, quantity: number, action: string): void {
    this.cartService
      .updateProductQuantity(product.productId, quantity, action, product.price)
      .subscribe({
        next: () => {
          this.loadCart();
        },
        error: (err) => console.error(err),
      });
  }
  public goToHome(): void {
    this.router.navigateByUrl('/home');
  }
  public goToCatalog(): void {
    this.router.navigateByUrl('/catalog');
  }
  addOrder(): void {
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    this.orderNumber =
      this.orders.length > 0
        ? String(this.orders[this.orders.length - 1].id + 1)
        : String(1);
    const newOrder: Order = {
      id:
        this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1,
      date: date.replaceAll('-', '.'),
      quantity: this.cartItems.length,
      total: this.total,
    };
    this.orderService.addOrder(newOrder).subscribe({
      next: () => {
        this.openOrderModal();
        this.removeAllItems();
      },
      error: (err) => console.error(err),
    });
  }
}
