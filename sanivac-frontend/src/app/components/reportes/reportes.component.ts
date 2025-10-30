import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../shared/services/reportes.service';
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

  // Datos para la tabla de vacunas
  usuarios: any[] = [];
  vacunas: any[] = [];
  vacunasFiltradas: any[] = [];
  
  // Datos de reportes (si los usas para otra cosa)
  reportesFiltrados: any[] = [];
  
  cargando = false;

  constructor(private repSrv: ReportesService, private http: HttpClient) {}

  ngOnInit() {
    this.generarAnios();
    this.cargarDatos();
  }

  generarAnios() {
    const anioActual = new Date().getFullYear();
    // Genera años desde 5 años atrás hasta 5 años adelante
    for (let i = anioActual + 5; i >= anioActual - 5; i--) {
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
        this.vacunas = this.agregarInfoPaciente(datos.vacunas, datos.usuarios);

        console.log('💉 Total vacunas antes de filtrar:', this.vacunas.length);
        console.log('📅 Filtrando por mes:', this.mesSeleccionado, 'año:', this.anioSeleccionado);

        // Mostrar rango de fechas disponibles
        if (this.vacunas.length > 0) {
          const fechas = this.vacunas
            .map(v => new Date(v.fecha_aplicacion))
            .sort((a, b) => a.getTime() - b.getTime());
          
          const fechaMin = fechas[0];
          const fechaMax = fechas[fechas.length - 1];
          
          console.log('📅 Rango de datos disponibles:');
          console.log(`   Desde: ${fechaMin.toLocaleDateString('es-CO')} (${this.meses[fechaMin.getMonth()].nombre} ${fechaMin.getFullYear()})`);
          console.log(`   Hasta: ${fechaMax.toLocaleDateString('es-CO')} (${this.meses[fechaMax.getMonth()].nombre} ${fechaMax.getFullYear()})`);
        }

        // Filtrar vacunas por mes y año
        this.filtrarVacunas();

        console.log('💉 Vacunas después de filtrar:', this.vacunasFiltradas.length);

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

  agregarInfoPaciente(vacunas: any[], usuarios: any[]) {
    // Une los datos del paciente con las vacunas por usuario_id
    return vacunas.map(v => {
      const usuario = usuarios.find(u => u.id === v.usuario_id);
      return {
        ...v,
        nombre_paciente: usuario
          ? `${usuario.primer_nombre} ${usuario.primer_apellido}`
          : 'Desconocido',
        numero_id: usuario ? usuario.numero_id : '---'
      };
    });
  }

  filtrarVacunas() {
    // Convertir a números para asegurar comparación correcta
    const mesNumero = Number(this.mesSeleccionado);
    const anioNumero = Number(this.anioSeleccionado);
    
    this.vacunasFiltradas = this.vacunas.filter(v => {
      if (!v.fecha_aplicacion) return false;
      
      const fecha = new Date(v.fecha_aplicacion);
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      
      return mes === mesNumero && anio === anioNumero;
    });
    
    console.log(`📊 ${this.vacunasFiltradas.length} vacunas encontradas para ${this.meses[mesNumero - 1]?.nombre} ${anioNumero}`);
    this.stats.totalVacunas = this.vacunasFiltradas.length;
  }

  // 📥 Descargar Excel con datos filtrados
  descargarExcel() {
    const nombreMes = this.meses.find(m => m.num === this.mesSeleccionado)?.nombre;

    this.http
      .post(
        'http://localhost:3000/api/reportes/generar-excel',
        {
          mes: this.mesSeleccionado,
          anio: this.anioSeleccionado,
          nombreMes: nombreMes
        },
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      .subscribe({
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

  // 🟢 Descargar template original (si lo necesitas)
  descargarTemplate() {
    this.http.get('http://localhost:3000/api/reportes/descargar-template', {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'REGISTRO DIARIO ESQUEMA REGULAR.xlsm';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('❌ Error al descargar template:', err);
        alert('Error al descargar la plantilla Excel.');
      }
    });
  }

  // 🖨️ Imprimir reporte
  imprimir() {
    window.print();
  }

  // 🔧 TrackBy functions para optimizar el renderizado de Angular
  // Estos métodos ayudan a Angular a identificar qué elementos cambiaron
  // en lugar de re-renderizar toda la lista
  trackByUsuarioId(index: number, item: any): number {
    return item?.id || index;
  }

  trackByVacunaId(index: number, item: any): number {
    return item?.id || index;
  }
}