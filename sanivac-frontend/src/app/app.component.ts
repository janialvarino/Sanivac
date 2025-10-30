import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mostrarNavbar$!: Observable<boolean>;
  rol: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    // 🔥 Combina: estar autenticado Y no estar en login
    this.mostrarNavbar$ = combineLatest([
      this.authService.usuario$.pipe(map(usuario => usuario !== null)),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url !== '/login' && event.url !== '/')
      )
    ]).pipe(
      map(([estaAutenticado, noEsLogin]) => estaAutenticado && noEsLogin)
    );

    // Escuchar cambios en el usuario para actualizar el rol
    this.authService.usuario$.subscribe(usuario => {
      this.rol = usuario ? usuario.rol : null;
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}