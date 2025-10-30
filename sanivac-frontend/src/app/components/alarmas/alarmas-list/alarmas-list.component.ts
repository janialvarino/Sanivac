import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AlarmasService } from '../../../shared/services/alarmas.service';

@Component({
  selector: 'app-alarmas-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './alarmas-list.component.html',
  styleUrls: ['./alarmas-list.component.css']
})
export class AlarmasListComponent implements OnInit {
  alarmas: any[] = [];
  cargando = false;

  constructor(private alarmasService: AlarmasService) {}

  ngOnInit(): void {
    this.cargarAlarmas();
  }

  cargarAlarmas(): void {
    this.cargando = true;
    this.alarmasService.obtenerAlarmas().subscribe({
      next: (data: any[]) => {
        this.alarmas = data;
        console.log('📋 Alarmas cargadas:', data);
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('❌ Error al cargar alarmas:', err);
        alert('Error al cargar las alarmas');
        this.cargando = false;
      }
    });
  }

  marcarAtendida(id: number): void {
    if (!confirm('¿Marcar esta alarma como atendida?')) {
      return;
    }

    this.alarmasService.marcarAtendida(id).subscribe({
      next: () => {
        alert('✅ Alarma marcada como atendida');
        this.cargarAlarmas();
      },
      error: (err: any) => {
        console.error('❌ Error al marcar alarma:', err);
        alert('Error al marcar la alarma');
      }
    });
  }

  getEstadoClase(alarma: any): string {
    if (alarma.estado === 'atendida') {
      return 'vacunado';
    }
    
    switch (alarma.estado_real) {
      case 'vencida':
        return 'vencida';
      case 'proxima':
        return 'proxima';
      default:
        return 'pendiente';
    }
  }

  getEstadoTexto(alarma: any): string {
    if (alarma.estado === 'atendida') {
      return '✅ Vacunado';
    }
    
    switch (alarma.estado_real) {
      case 'vencida':
        return '🔴 Vencida';
      case 'proxima':
        return '🟡 Próxima';
      case 'sin_seguimiento':
        return 'Sin seguimiento';
      default:
        return '⏳ Pendiente';
    }
  }

  puedeMarcar(alarma: any): boolean {
    return alarma.estado !== 'atendida';
  }
}