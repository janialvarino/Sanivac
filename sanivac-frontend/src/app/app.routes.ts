import { Routes } from '@angular/router';

// Importamos los componentes standalone
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Usuarios
import { UsuarioListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';

// Vacunas
import { VacunasListComponent } from './components/vacunas/vacunas-list/vacunas-list.component';
import { VacunasFormComponent } from './components/vacunas/vacuna-form/vacuna-form.component';

// Reportes
import { ReportesComponent } from './components/reportes/reportes.component';

// Inventario
import { InventarioComponent } from './components/inventario/inventario.component';

// Alarmas
import { AlarmasComponent } from './components/alarmas/alarmas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ruta por defecto
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Usuarios
  { path: 'usuarios', component: UsuarioListComponent },
  { path: 'usuarios/form', component: UsuarioFormComponent },

  // Vacunas
  { path: 'vacunas', component: VacunasListComponent },
  { path: 'vacunas/form', component: VacunasFormComponent },

  // Reportes
  { path: 'reportes', component: ReportesComponent },

  // Inventario
  { path: 'inventario', component: InventarioComponent },

  // Alarmas
  { path: 'alarmas', component: AlarmasComponent },
];

