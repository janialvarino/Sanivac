import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  meses = [
    { num: 1, nombre: 'Enero' },
    { num: 2, nombre: 'Febrero' },
    { num: 3, nombre: 'Marzo' },
    { num: 4, nombre: 'Abril' },
    { num: 5, nombre: 'Mayo' },
    { num: 6, nombre: 'Junio' },
    { num: 7, nombre: 'Julio' },
    { num: 8, nombre: 'Agosto' },
    { num: 9, nombre: 'Septiembre' },
    { num: 10, nombre: 'Octubre' },
    { num: 11, nombre: 'Noviembre' },
    { num: 12, nombre: 'Diciembre' }
  ];

  anios: number[] = [];
  mesSeleccionado = new Date().getMonth() + 1;
  anioSeleccionado = new Date().getFullYear();

  // Estadísticas
  stats = {
    totalUsuarios: 0,
    totalVacunas: 0,
    totalInventario: 0,
    totalAlarmas: 0
  };

  // Datos
  usuarios: any[] = [];
  vacunas: any[] = [];
  vacunasFiltradas: any[] = [];
  cargando = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.generarAnios();
    this.cargarDatos();
  }

  generarAnios() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= anioActual - 5; i--) {
      this.anios.push(i);
    }
  }

  cargarDatos() {
    this.cargando = true;

    forkJoin({
      usuarios: this.http.get<any[]>('http://localhost:3000/api/usuarios'),
      vacunas: this.http.get<any[]>('http://localhost:3000/api/vacunas'),
      dashboard: this.http.get<any>('http://localhost:3000/api/dashboard')
    }).subscribe({
      next: (datos) => {
        console.log('📊 Datos cargados:', datos);

        this.usuarios = datos.usuarios;
        this.vacunas = datos.vacunas;

        // Filtrar vacunas por mes y año
        this.filtrarVacunas();

        // Estadísticas
        this.stats.totalUsuarios = datos.usuarios.length;
        this.stats.totalVacunas = this.vacunasFiltradas.length;
        this.stats.totalInventario = datos.dashboard.vacunas?.disponibles || 0;
        this.stats.totalAlarmas = datos.dashboard.alarmas || 0;

        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar datos:', err);
        alert('Error al cargar los datos del sistema');
        this.cargando = false;
      }
    });
  }

  filtrarVacunas() {
    this.vacunasFiltradas = this.vacunas.filter(v => {
      if (!v.fecha_aplicacion) return false;
      const fecha = new Date(v.fecha_aplicacion);
      return fecha.getMonth() + 1 === this.mesSeleccionado &&
             fecha.getFullYear() === this.anioSeleccionado;
    });
    this.stats.totalVacunas = this.vacunasFiltradas.length;
  }

  // 📥 Descargar Excel con todos los datos
  descargarExcel() {
    const nombreMes = this.meses.find(m => m.num === this.mesSeleccionado)?.nombre;
    
    this.http.post('http://localhost:3000/api/reportes/generar-excel', {
      mes: this.mesSeleccionado,
      anio: this.anioSeleccionado,
      nombreMes: nombreMes
    }, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Reporte_Sanivac_${nombreMes}_${this.anioSeleccionado}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log('✅ Excel descargado');
      },
      error: (err) => {
        console.error('❌ Error al descargar Excel:', err);
        alert('Error al generar el reporte Excel');
      }
    });
  }

  // 🖨️ Imprimir reporte
  imprimir() {
    window.print();
  }
}