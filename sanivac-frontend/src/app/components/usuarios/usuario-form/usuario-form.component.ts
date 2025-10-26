import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../shared/services/usuarios.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  usuario: any = {};
  modoEdicion = false;
  esNino = false;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.usuariosService.getUsuarioPorId(id).subscribe({
        next: (data) => {
          this.usuario = data;
          this.verificarTipo();
        },
        error: (err) => {
          console.error('❌ Error al cargar usuario:', err);
          alert('No se pudo cargar el usuario');
        }
      });
    } else {
      this.usuario = {
        tipo_id: '',
        numero_id: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        fecha_nacimiento: '',
        sexo: '',
        direccion: '',
        telefono: '',
        eps: ''
      };
    }
  }

  verificarTipo() {
    const tipo = this.usuario.tipo_id?.toUpperCase() || '';
    this.esNino = tipo === 'REGISTRO CIVIL' || tipo === 'TARJETA DE IDENTIDAD';
    console.log('👤 Tipo detectado:', tipo, '| Es menor:', this.esNino);
  }

  guardar() {
    if (this.modoEdicion) {
      this.usuariosService.actualizarUsuario(this.usuario.id, this.usuario).subscribe({
        next: () => {
          alert('✅ Usuario actualizado correctamente');
          // NO redirigir automáticamente, permitir completar datos clínicos
          this.verificarTipo(); // Actualizar el estado del botón
        },
        error: (err) => {
          console.error('❌ Error al actualizar usuario:', err);
          alert('No se pudo actualizar el usuario');
        }
      });
    } else {
      this.usuariosService.createUsuario(this.usuario).subscribe({
        next: (res) => {
          console.log('✅ Usuario creado:', res);
          alert('✅ Usuario guardado correctamente. Ahora puedes completar sus datos clínicos.');
          
          // Asignar el ID del usuario recién creado
          this.usuario.id = res.id;
          this.modoEdicion = true;
          this.verificarTipo(); // Mostrar el botón de datos clínicos
        },
        error: (err) => {
          console.error('❌ Error al guardar usuario:', err);
          alert('No se pudo guardar el usuario');
        }
      });
    }
  }

  abrirDatosClinicos() {
    if (!this.usuario.id) {
      alert('⚠️ Primero debes guardar el usuario');
      return;
    }
    this.router.navigate([`/usuarios/datos-clinicos/${this.usuario.id}`]);
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }
}