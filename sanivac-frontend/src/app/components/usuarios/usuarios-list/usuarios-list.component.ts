import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuarioListComponent {
  usuarios = [
    { id:1, numero_id: '12345', nombre: 'Juan Pérez', edad: 34, telefono: '3001234567' },
    { id:2, numero_id: '67890', nombre: 'María Gómez', edad: 28, telefono: '3109876543' }
  ];
}
