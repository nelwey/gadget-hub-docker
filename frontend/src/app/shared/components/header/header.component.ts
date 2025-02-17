import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public currentRoute: string = '';

  cartQuantity: number = 0;

  constructor(public authService: AuthService, private router: Router, private cartService: CartService) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
  public goToLogin() {
    this.router.navigateByUrl('/login');
  }
  public goToHome() {
    this.router.navigateByUrl('/home');
  }
  public goToCatalog() {
    this.router.navigateByUrl('/catalog');
  }
  public goToCart() {
    this.router.navigateByUrl('/cart');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cartService.currentCartQuantity.subscribe(quantity => {
      this.cartQuantity = quantity;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
