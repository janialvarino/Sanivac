import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fechaActual = new Date().toLocaleDateString('es-CO', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  horaActual = new Date().toLocaleTimeString('es-CO', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  stats = {
    totalVacunas: 0,
    vacunasAplicadas: 0,
    vacunasDisponibles: 0,
    vacunasVencidas: 0,
    totalUsuarios: 0,
    usuariosVacunados: 0,
    usuariosPendientes: 0,
    alarmasActivas: 0,
    porcentajeVacunacion: 0
  };

  datosVacunasPorTipo: any[] = [];
  datosPacientesPorGrupo: any = { ninos: 0, adultos: 0, otros: 0 };

  cargando = true;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    this.cargando = true;
    console.log('🔄 Cargando dashboard...');

    // Cargar datos del endpoint /api/dashboard
    this.http.get<any>('http://localhost:3000/api/dashboard').subscribe({
      next: (dashboard) => {
        console.log('📊 Dashboard recibido:', dashboard);
        
        this.stats.vacunasDisponibles = dashboard.vacunas?.disponibles || 0;
        this.stats.vacunasAplicadas = dashboard.vacunas?.aplicadas || 0;
        this.stats.usuariosVacunados = dashboard.pacientes?.vacunados || 0;
        this.stats.usuariosPendientes = dashboard.pacientes?.pendientes || 0;
        this.stats.alarmasActivas = dashboard.alarmas || 0; // ✅ CORREGIDO
        this.stats.totalUsuarios = this.stats.usuariosVacunados + this.stats.usuariosPendientes;

        console.log('🔔 Alarmas activas:', this.stats.alarmasActivas);

        // Cargar datos para gráficas
        this.cargarDatosGraficas();
      },
      error: (err) => {
        console.error('❌ Error al cargar dashboard:', err);
        alert('Error al cargar el dashboard');
        this.cargando = false;
      }
    });
  }

  cargarDatosGraficas() {
    // Obtener vacunas aplicadas
    this.http.get<any[]>('http://localhost:3000/api/vacunas').subscribe({
      next: (vacunas) => {
        console.log('💉 Vacunas recibidas:', vacunas.length);
        
        // Filtrar vacunas con nombre válido
        const vacunasValidas = vacunas.filter(v => v.nombre_vacuna && v.nombre_vacuna.trim() !== '');
        
        if (vacunasValidas.length === 0) {
          console.warn('⚠️ No hay vacunas con nombre válido');
          this.datosVacunasPorTipo = [{ nombre: 'Sin datos', cantidad: 0 }];
        } else {
          this.procesarVacunasPorTipo(vacunasValidas);
        }
        
        // Cargar usuarios para distribución por edad
        this.http.get<any[]>('http://localhost:3000/api/usuarios').subscribe({
          next: (usuarios) => {
            console.log('👥 Usuarios recibidos:', usuarios.length);
            this.procesarDistribucionEdades(usuarios);
            this.cargando = false;
            this.renderCharts();
          },
          error: (err) => {
            console.error('❌ Error al cargar usuarios:', err);
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar vacunas:', err);
        this.cargando = false;
      }
    });
  }

  procesarVacunasPorTipo(vacunas: any[]) {
    const conteoPorVacuna: any = {};
    
    vacunas.forEach((v: any) => {
      const nombre = v.nombre_vacuna.trim();
      conteoPorVacuna[nombre] = (conteoPorVacuna[nombre] || 0) + 1;
    });

    this.datosVacunasPorTipo = Object.entries(conteoPorVacuna)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a: any, b: any) => b.cantidad - a.cantidad)
      .slice(0, 5);

    console.log('📊 Top 5 vacunas:', this.datosVacunasPorTipo);
  }

  procesarDistribucionEdades(usuarios: any[]) {
    let ninos = 0, adultos = 0, otros = 0;

    usuarios.forEach((u: any) => {
      if (u.fecha_nacimiento) {
        const edad = this.calcularEdad(u.fecha_nacimiento);
        if (edad < 18) ninos++;
        else if (edad >= 18 && edad < 60) adultos++;
        else otros++;
      }
    });

    const total = ninos + adultos + otros;
    this.datosPacientesPorGrupo = {
      ninos: total > 0 ? Math.round((ninos / total) * 100) : 0,
      adultos: total > 0 ? Math.round((adultos / total) * 100) : 0,
      otros: total > 0 ? Math.round((otros / total) * 100) : 0
    };

    console.log('👶 Distribución por edad:', this.datosPacientesPorGrupo);
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  renderCharts() {
    setTimeout(() => {
      console.log('🎨 Renderizando gráficas...');

      const chartVacunas = Chart.getChart('chartVacunas');
      if (chartVacunas) chartVacunas.destroy();

      const chartPacientes = Chart.getChart('chartPacientes');
      if (chartPacientes) chartPacientes.destroy();

      const canvasVacunas = document.getElementById('chartVacunas') as HTMLCanvasElement;
      const canvasPacientes = document.getElementById('chartPacientes') as HTMLCanvasElement;

      if (!canvasVacunas || !canvasPacientes) {
        console.error('❌ Canvas no encontrados');
        return;
      }

      // GRÁFICA DE BARRAS
      const colores = ['#42a5f5', '#66bb6a', '#ef5350', '#ffa726', '#ab47bc'];
      
      new Chart(canvasVacunas, {
        type: 'bar',
        data: {
          labels: this.datosVacunasPorTipo.map((v: any) => v.nombre),
          datasets: [{
            label: 'Cantidad',
            data: this.datosVacunasPorTipo.map((v: any) => v.cantidad),
            backgroundColor: colores.slice(0, this.datosVacunasPorTipo.length),
            borderRadius: 8,
            barThickness: 60
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 5 } }
          }
        }
      });

      // GRÁFICA DE DONA
      new Chart(canvasPacientes, {
        type: 'doughnut',
        data: {
          labels: ['Niños (0-17)', 'Adultos (18-59)', 'Mayores (60+)'],
          datasets: [{
            data: [
              this.datosPacientesPorGrupo.ninos,
              this.datosPacientesPorGrupo.adultos,
              this.datosPacientesPorGrupo.otros
            ],
            backgroundColor: ['#42a5f5', '#ef5350', '#66bb6a'],
            borderWidth: 3,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: { legend: { display: false } }
        }
      });

      console.log('✅ Gráficas renderizadas');
    }, 300);
  }

  irA(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}