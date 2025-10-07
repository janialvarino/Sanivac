import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alarmas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarmas.component.html',
  styleUrls: ['./alarmas.component.css']
})
export class AlarmasComponent {
  alarmas = [
    { id:1, mensaje: 'Vacunas COVID: stock bajo', fecha: '2025-10-05', tipo:'stock' },
    { id:2, mensaje: 'Vacuna Influenza: próxima a vencer', fecha: '2025-11-15', tipo:'vencimiento' }
  ];
}

