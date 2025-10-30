import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// 🧩 Componentes principales
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// 👩‍💼 Usuarios
import { UsuarioListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { DatosClinicosComponent } from './components/usuarios/datos-clinicos/datos-clinicos.component';

// 💉 Vacunas
import { VacunasListComponent } from './components/vacunas/vacunas-list/vacunas-list.component';
import { VacunaFormComponent } from './components/vacunas/vacuna-form/vacuna-form.component';

// 📦 Inventario
import { InventarioListComponent } from './components/inventario/inventario-list/inventario-list.component';
import { InventarioFormComponent } from './components/inventario/inventario-form/inventario-form.component';

// ⏰ Alarmas
import { AlarmasListComponent } from './components/alarmas/alarmas-list/alarmas-list.component';

// 📊 Reportes
import { ReportesComponent } from './components/reportes/reportes.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 📋 Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // 👩‍💼 Usuarios
  { path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'usuarios/form', component: UsuarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'usuarios/form/:id', component: UsuarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'usuarios/datos-clinicos/:id', component: DatosClinicosComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },

  // 💉 Vacunas
  { path: 'vacunas', component: VacunasListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },
  { path: 'vacunas/form', component: VacunaFormComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },
  {
    path: 'vacunas/detalle/:id',
    loadComponent: () =>
      import('./components/vacunas/vacunas-detalle/vacunas-detalle.component')
        .then(m => m.VacunasDetalleComponent),
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'enfermera'] }
  },

  // 📦 Inventario
  { path: 'inventario', component: InventarioListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'inventario/form', component: InventarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'inventario/form/:id', component: InventarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  // ⏰ Alarmas
  { path: 'alarmas', component: AlarmasListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },

  // 📊 Reportes
  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  // 🚫 Ruta por defecto
  { path: '**', redirectTo: 'login' }
];
