import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  loading = false;
  error = '';
  terminoBusqueda: string = '';

  // Variables para el modal
  mostrarDialogo: boolean = false;
  usuarioAEliminar: any = null;

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  buscar() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.numero_id && u.numero_id.toString().toLowerCase().includes(termino)
    );
  }

  editarUsuario(id: number) {
    this.router.navigate(['/usuarios/form', id]);
  }

  crearUsuario() {
    this.router.navigate(['/usuarios/form']);
  }

  // Abre el modal de confirmación
  confirmarEliminar(usuario: any) {
    this.usuarioAEliminar = usuario;
    this.mostrarDialogo = true;
  }

  // Elimina el usuario después de confirmar
  eliminarUsuario() {
    if (!this.usuarioAEliminar) return;

    this.usuariosService.eliminarUsuario(this.usuarioAEliminar.id).subscribe({
      next: () => {
        alert('Usuario eliminado');
        this.cargarUsuarios();
        this.usuarioAEliminar = null;
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
        alert('No se pudo eliminar el usuario');
      }
    });
  }

  // Cancela la eliminación
  cancelarEliminacion() {
    this.usuarioAEliminar = null;
    this.mostrarDialogo = false;
  }

  // 📅 Calcular edad desde fecha de nacimiento
  calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }
}