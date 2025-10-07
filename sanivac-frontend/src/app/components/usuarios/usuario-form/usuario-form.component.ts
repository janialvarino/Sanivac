import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent {
  usuario: any = {
    tipo_id: '',
    numero_id: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    fecha_nacimiento: '',
    sexo: 'F',
    direccion: '',
    telefono: '',
    eps: ''
  };
  constructor(private router: Router) {}

  guardar() {
    console.log('guardar usuario', this.usuario);
    // Aquí llamar al service para guardar
    alert('Usuario guardado (simulado).');
    this.router.navigate(['/usuarios']);
  }
}
