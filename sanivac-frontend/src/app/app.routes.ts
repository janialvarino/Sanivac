import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

// Importamos los componentes standalone
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Usuarios
import { UsuarioListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';

// Vacunas
import { VacunasListComponent } from './components/vacunas/vacunas-list/vacunas-list.component';
import { VacunaFormComponent } from './components/vacunas/vacuna-form/vacuna-form.component';

// 📦 Inventario
import { InventarioListComponent } from './components/inventario/inventario-list/inventario-list.component';
import { InventarioFormComponent } from './components/inventario/inventario-form/inventario-form.component';


// ⏰ Alarmas
import { AlarmasListComponent } from './components/alarmas/alarmas-list/alarmas-list.component';

// 📊 Reportes
import { ReportesComponent } from './components/reportes/reportes.component';

import { DatosClinicosComponent } from './components/usuarios/datos-clinicos/datos-clinicos.component';




export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Dashboard (acceso para todos los roles)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // 👩‍💼 Usuarios (solo administradora)
  { path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'usuarios/form', component: UsuarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'usuarios/form/:id', component: UsuarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  // 💉 Vacunas (enfermera y administradora)
  { path: 'vacunas', component: VacunasListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },
  { path: 'vacunas/form', component: VacunaFormComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },

  // 📦 Inventario (solo admin)
  { path: 'inventario', component: InventarioListComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'inventario/form', component: InventarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'inventario/form/:id', component: InventarioFormComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  // ⏰ Alarmas (admin y enfermera)
  { path: 'alarmas', component: AlarmasListComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'enfermera'] } },

  // 📊 Reportes (solo admin)
  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },


{
  path: 'vacunas/detalle/:id',
  loadComponent: () =>
    import('./components/vacunas/vacunas-detalle/vacunas-detalle.component')
      .then(m => m.VacunasDetalleComponent),
  canActivate: [AuthGuard],
  data: { roles: ['admin', 'enfermera'] }
},

{ path: 'usuarios/datos-clinicos/:id', component: DatosClinicosComponent }, // ✅ Nueva ruta



  // Ruta por defecto
  { path: '**', redirectTo: 'login' }
];
