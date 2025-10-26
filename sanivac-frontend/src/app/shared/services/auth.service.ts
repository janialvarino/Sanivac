import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // 👈 backend auth

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user: any) => {
        localStorage.setItem('usuario', JSON.stringify(user)); // 👈 guarda usuario y rol
      })
    );
    
  }

  logout() {
    localStorage.removeItem('usuario'); // o sesión
  }

   getUsuario() {
    return JSON.parse(localStorage.getItem('usuario') || 'null');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  getRol(): string | null {
    const user = this.getUsuario();
    return user ? user.rol : null;
  }

}
