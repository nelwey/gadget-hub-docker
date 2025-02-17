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
  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadCart();
    this.loadOrders();
  }

  public cartItems: any[] = [];
  public orders: Order[] = [];
  public selectedTab: string = 'cart';
  public selectedProduct: Product | null = null;

  public paymentMethods = [
    { value: 'value 2', label: 'value 1' },
    { value: 'value 1', label: 'value 2' },
  ];
  public selectedPaymentMethod: string = this.paymentMethods[0].value;

  public selectedTypeOrder: string = "Самовывоз";

  public showOrderModal: boolean = false;
  public selectAllChecked: boolean = false;

  public orderNumber: string = "";

  toggleSelectAll() {
    this.cartItems.forEach(product => product.selected = this.selectAllChecked);
  }

  onChangePaymentMethod(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedPaymentMethod = target.value;
  }

  openOrderModal() {
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.showOrderModal = false;
  }
  openModal(product: any) {
    this.selectedProduct = product;
    if (this.selectedProduct) {
      this.selectedProduct.id = product.productId;
    }
  }

  closeModal() {
    this.selectedProduct = null;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items.map(item => ({ ...item, selected: false }));
      },
      error: (err) => console.error(err),
    });
  }
  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => console.error(err),
    });
  }
  get total() {
    let total = 0;
    this.cartItems.forEach((product) => {
      total += product.subtotal;
    })
    return total;
  }

  removeItem() {
    if (this.selectedProduct) {
      this.cartService.removeFromCart(this.selectedProduct.id).subscribe({
        next: (response) => {
          this.loadCart();
          this.closeModal();
        },
        error: (err) => console.error(err),
      });
    }
  }
  removeAllSelectedItems() {
    const selectedProducts = this.cartItems.filter(product => product.selected);

    if (selectedProducts.length > 0) {
      selectedProducts.forEach(product => {
        this.cartService.removeFromCart(product.id).subscribe({
          next: (response) => {
            console.log(`Product with ID ${product.id} removed from cart.`);
            this.loadCart();
          },
          error: (err) => console.error('Error removing product from cart:', err),
        });
      });
      this.cartItems = [];
    }
  }
  removeAllItems() {
    this.cartItems.forEach(item => {
      this.cartService.removeFromCart(item.productId).subscribe({
        next: (response) => {
          this.ngOnInit();
        },
        error: (err) => console.error('Error removing product from cart:', err),
      });
    });
  }

  increaseQuantity(product: any) {

    if (product && this.isInCart(product)) {
      this.updateCartQuantity(product, 1, "increase");
    }
  }

  decreaseQuantity(product: any) {
    if (product && this.isInCart(product)) {
      this.updateCartQuantity(product, 1, "decrease");
    }
  }
  isInCart(product: any): boolean {
    return this.cartService.isProductInCart(product.productId);
  }
  updateCartQuantity(product: any, quantity: number, action: string) {
    this.cartService.updateProductQuantity(product.productId, quantity, action, product.price).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (err) => console.error(err),
    });
  }
  public goToHome() {
    this.router.navigateByUrl('/home');
  }
  public goToCatalog() {
    this.router.navigateByUrl('/catalog');
  }
  addOrder() {
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    this.orderNumber = this.orders.length > 0 ? String(this.orders[this.orders.length - 1].id + 1) : String(1);
    const newOrder: Order = {
      id: this.orders.length > 0 ? this.orders[this.orders.length - 1].id + 1 : 1,
      date: date.replaceAll("-", '.'),
      quantity: this.cartItems.length,
      total: this.total
    }
    this.orderService.addOrder(newOrder).subscribe({
      next: (response) => {
        console.log("response: ", response);
        this.openOrderModal();
        this.removeAllItems();
      },
      error: (err) => console.error(err),
    });

  }
}
