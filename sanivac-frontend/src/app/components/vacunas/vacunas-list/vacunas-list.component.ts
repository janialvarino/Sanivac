import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { VacunasService } from '../../../shared/services/vacunas.service';
import { EsquemaVacunacionService } from '../../../shared/services/esquema-vacunacion.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-vacunas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacunas-list.component.html',
  styleUrls: ['./vacunas-list.component.css']
})
export class VacunasListComponent implements OnInit {
  vacunas: any[] = [];
  cargando: boolean = false;

  constructor(
    private vacunasService: VacunasService,
    private esquemaService: EsquemaVacunacionService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/vacunas') {
        this.cargarVacunas();
      }
    });
  }

  ngOnInit(): void {
    this.cargarVacunas();
  }

  cargarVacunas() {
    this.cargando = true;
    this.vacunasService.getVacunas().subscribe({
      next: (data) => {
        console.log('📋 Vacunas cargadas:', data);
        this.vacunas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar vacunas:', err);
        alert('Error al cargar vacunas');
        this.cargando = false;
      }
    });
  }

  irAFormulario() {
    this.router.navigate(['/vacunas/form']);
  }

  verEsquema(vacuna: any) {
  console.log('🔍 Ver esquema para usuario:', vacuna.usuario_id);
  
  if (!vacuna.usuario_id) {
    alert('❌ No se encontró el ID del usuario');
    return;
  }

  this.router.navigate(['/vacunas/detalle', vacuna.usuario_id]);
}
  
}