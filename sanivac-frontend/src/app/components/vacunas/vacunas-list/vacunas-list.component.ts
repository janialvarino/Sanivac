import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vacunas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vacunas-list.component.html',
  styleUrls: ['./vacunas-list.component.css']
})
export class VacunasListComponent {
  vacunas = [
    { id:1, usuario: 'Juan Pérez', nombre_vacuna:'COVID-19', dosis: '1ra', lote:'A123', fecha:'2025-01-15' },
    { id:2, usuario: 'María Gómez', nombre_vacuna:'Influenza', dosis: 'Anual', lote:'B456', fecha:'2025-02-01' }
  ];
}

