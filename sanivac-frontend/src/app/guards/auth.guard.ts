import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const usuario = this.authService.getUsuario();

    // 🔥 Si intenta acceder a la raíz sin sesión
    if (!usuario) {
      console.log('🔒 Usuario no autenticado, redirigiendo al login');
      return this.router.createUrlTree(['/login']);
    }

    // 🔑 Validar roles
    const rolesPermitidos = route.data?.['roles'];
    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
      alert('⚠️ No tienes permiso para acceder a esta sección.');
      return this.router.createUrlTree(['/inventario']);
    }

    // ✅ Todo correcto → permitir acceso
    return true;
  }
}