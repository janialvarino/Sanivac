// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  rol: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.actualizarEstado();

     this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/' || event.url === '') {
        this.authService.logout();
      }});
  }

  actualizarEstado() {
    this.isLoggedIn = this.authService.isLoggedIn();
    const usuario = this.authService.getUsuario();
    this.rol = usuario ? usuario.rol : null;
  }

  cerrarSesion() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
