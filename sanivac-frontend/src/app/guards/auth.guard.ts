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

    if (!usuario) {
      // 🔒 No autenticado → redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    // 🔑 Validar roles
    const rolesPermitidos = route.data?.['roles'];
    if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
      alert('⚠️ No tienes permiso para acceder a esta sección.');
      this.router.navigate(['/dashboard']);
      return false;
    }

    // ✅ Todo correcto → permitir acceso
    return true;
  }
}
