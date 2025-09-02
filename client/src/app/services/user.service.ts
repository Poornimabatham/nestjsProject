import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // Update this if your backend runs on a different port

  constructor(private http: HttpClient) {}

  signup(userData: SignupData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, userData).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred during signup';
        if (error.status === 409) {
          errorMessage = error.error.message || 'User with this email already exists';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginData).pipe(
      catchError(error => {
          let errorMessage = 'An error occurred during login';
          console.log(error.status,"error")
          if (error.status === 401) {
            console.log(error.error.message,"error")
          errorMessage = error.error.message || 'Invalid email or password';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getProducts(search?: string): Observable<any> {
    let params = new HttpParams();
    
    if (search) {
      params = params.set('search', search);
    }
  return this.http.get('http://localhost:3000/products', { params });
  }
}
