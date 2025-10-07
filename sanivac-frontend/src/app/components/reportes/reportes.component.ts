import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  reportes = [
    { id:1, nombre:'Reporte mensual - Octubre', fecha:'2025-10-01' },
    { id:2, nombre:'Reporte vacunación por tipo', fecha:'2025-09-01' }
  ];
}
