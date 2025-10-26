import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

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

  cargando = true;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard() {
    this.cargando = true;

    forkJoin({
      dashboard: this.http.get<any>('http://localhost:3000/api/dashboard')
    }).subscribe({
      next: (datos) => {
        console.log('📊 Datos cargados:', datos);

        this.stats.vacunasDisponibles = datos.dashboard.vacunas.disponibles || 0;
        this.stats.vacunasAplicadas = datos.dashboard.vacunas.aplicadas || 0;
        this.stats.vacunasVencidas = datos.dashboard.vacunas.agotadas || 0;
        this.stats.totalVacunas = this.stats.vacunasDisponibles + this.stats.vacunasAplicadas;

        this.stats.usuariosVacunados = datos.dashboard.pacientes.vacunados || 0;
        this.stats.usuariosPendientes = datos.dashboard.pacientes.pendientes || 0;
        this.stats.totalUsuarios = this.stats.usuariosVacunados + this.stats.usuariosPendientes;

        this.stats.alarmasActivas = datos.dashboard.alarmas || 0;

        if (this.stats.totalUsuarios > 0) {
          this.stats.porcentajeVacunacion = Math.round(
            (this.stats.usuariosVacunados / this.stats.totalUsuarios) * 100
          );
        }

        this.cargando = false;
        this.renderCharts();
      },
      error: (err) => {
        console.error('❌ Error al cargar datos:', err);
        this.cargando = false;
        this.renderCharts();
      }
    });
  }

  renderCharts() {
    setTimeout(() => {
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

      console.log('✅ Renderizando gráficas...');

      // Gráfica de barras - Vacunas
      new Chart(canvasVacunas, {
        type: 'bar',
        data: {
          labels: ['Influenza', 'Tétano', 'COVID-19'],
          datasets: [{
            label: 'Cantidad',
            data: [28, 24, 36],
            backgroundColor: ['#42a5f5', '#66bb6a', '#ef5350'],
            borderRadius: 8,
            barThickness: 60
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: false }
          },
          scales: {
            y: { 
              beginAtZero: true,
              ticks: { 
                stepSize: 10,
                font: { size: 12 }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 12 }
              }
            }
          }
        }
      });

      // Gráfica de dona - Pacientes
      new Chart(canvasPacientes, {
        type: 'doughnut',
        data: {
          labels: ['Niños', 'Adultos', 'Soldados'],
          datasets: [{
            data: [40, 35, 25],
            backgroundColor: ['#42a5f5', '#ef5350', '#66bb6a'],
            borderWidth: 3,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { 
              display: false 
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  return label + ': ' + value + '%';
                }
              }
            }
          }
        }
      });

      console.log('✅ Gráficas renderizadas correctamente');
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