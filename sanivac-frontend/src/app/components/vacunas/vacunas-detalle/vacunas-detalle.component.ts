import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { EsquemaVacunacionService } from '../../../shared/services/esquema-vacunacion.service';
import { VacunasService } from '../../../shared/services/vacunas.service';
import { UsuariosService } from '../../../shared/services/usuarios.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-vacunas-detalle',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './vacunas-detalle.component.html',
  styleUrls: ['./vacunas-detalle.component.css']
})
export class VacunasDetalleComponent implements OnInit {
  esquema: any = null;
  vacunasPaciente: any[] = [];
  datosUsuario: any = null;
  usuarioId!: number;
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private esquemaService: EsquemaVacunacionService,
    private vacunasService: VacunasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🔍 Cargando datos para usuario ID:', this.usuarioId);

    if (!this.usuarioId || isNaN(this.usuarioId)) {
      this.error = 'ID de usuario inválido';
      this.cargando = false;
      return;
    }

    this.obtenerDatos();
  }

  obtenerDatos() {
    this.cargando = true;

    forkJoin({
      usuario: this.usuariosService.getUsuarioPorId(this.usuarioId).pipe(
        catchError(err => {
          console.error('Error al cargar usuario:', err);
          return of(null);
        })
      ),
      esquema: this.esquemaService.getByPaciente(this.usuarioId).pipe(
        catchError(err => {
          console.error('Error al cargar esquema:', err);
          return of([]);
        })
      ),
      vacunas: this.vacunasService.getVacunasPorUsuario(this.usuarioId).pipe(
        catchError(err => {
          console.error('Error al cargar vacunas:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (resultado) => {
        console.log('✅ Datos cargados:', resultado);
        this.datosUsuario = resultado.usuario;
        this.vacunasPaciente = resultado.vacunas || [];

        // Verificar si el campo registrado_pai llega
        console.log('🧾 Datos usuario:', this.datosUsuario);

        if (!resultado.esquema || resultado.esquema.length === 0) {
          console.log('⚠️ No existe esquema, creando uno nuevo...');
          this.crearEsquemaAutomatico();
        } else {
          this.esquema = resultado.esquema[0];
          this.cargando = false;
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar datos:', err);
        this.error = 'Error al cargar la información del paciente';
        this.cargando = false;
      }
    });
  }

  crearEsquemaAutomatico() {
    const nuevoEsquema = {
      usuario_id: this.usuarioId,
      tipo_carnet: 'Carnet de Vacunación',
      observaciones: 'Esquema creado automáticamente'
    };

    console.log('🆕 Creando esquema:', nuevoEsquema);

    this.esquemaService.create(nuevoEsquema).subscribe({
      next: (response) => {
        console.log('✅ Esquema creado exitosamente:', response);
        this.esquemaService.getByPaciente(this.usuarioId).subscribe({
          next: (data) => {
            this.esquema = data && data.length > 0 ? data[0] : null;
            this.cargando = false;
          },
          error: (err) => {
            console.error('Error al recargar esquema:', err);
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al crear esquema:', err);
        this.error = 'Error al crear el esquema de vacunación';
        this.cargando = false;
      }
    });
  }

  get responsable(): string {
    if (this.vacunasPaciente.length > 0 && this.vacunasPaciente[0]?.responsable) {
      return this.vacunasPaciente[0].responsable;
    }
    return 'No registrado';
  }

  imprimir() {
    window.print();
  }

  volver() {
    this.router.navigate(['/vacunas']);
  }
}
