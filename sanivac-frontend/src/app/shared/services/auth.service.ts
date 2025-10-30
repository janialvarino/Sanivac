import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // 🔥 NUEVO - Observable reactivo para notificar cambios
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    // 🔥 Al cargar el servicio, verifica si hay un usuario guardado
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuarioSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user: any) => {
        localStorage.setItem('usuario', JSON.stringify(user));
        this.usuarioSubject.next(user); // 🔥 Notifica que hay un nuevo usuario
      })
    );
  }

  logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null); // 🔥 Notifica que ya no hay usuario
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