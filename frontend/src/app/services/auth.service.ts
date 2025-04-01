import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  public constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
        }
        return response;
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  public getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
