import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'shared-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public isLoggedIn = false;
  public currentRoute = '';

  public cartQuantity = 0;

  public constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
  public goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
  public goToHome(): void {
    this.router.navigateByUrl('/home');
  }
  public goToCatalog(): void {
    this.router.navigateByUrl('/catalog');
  }
  public goToCart(): void {
    this.router.navigateByUrl('/cart');
  }

  public ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.cartService.currentCartQuantity.subscribe((quantity) => {
      this.cartQuantity = quantity;
    });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
