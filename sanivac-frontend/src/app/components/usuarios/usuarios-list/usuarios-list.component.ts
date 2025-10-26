import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../shared/services/usuarios.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = []; // 🔍 lista visible en la tabla
  loading = false;
  error = '';
  terminoBusqueda: string = ''; // 🔍 valor del input

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data; // 🔍 inicializa
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  // 🔍 Buscar por número de identificación
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

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        alert('Usuario eliminado');
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
        alert('No se pudo eliminar el usuario');
      }
    });
  }
}
