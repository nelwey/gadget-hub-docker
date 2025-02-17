import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor(private authService: AuthService,private router: Router) { }
  public email: string = "";
  public password: string = "";
  public errorMessage: string = '';


  login(): void {
    console.log(`login: ${this.email}, ${this.password}`);
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/catalog']),
      error: (err) => this.errorMessage = err
    });
  }

}
