import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VacunasService } from '../../../shared/services/vacunas.service';
import { UsuariosService } from '../../../shared/services/usuarios.service';

@Component({
  selector: 'app-vacuna-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacuna-form.component.html',
  styleUrls: ['./vacuna-form.component.css']
})
export class VacunaFormComponent implements OnInit {
  vacuna = {
    usuario_id: '',
    numero_id: '',
    tipo_carnet: '',
    nombre_vacuna: '',
    laboratorio: '', // ✅ NUEVO
    dosis: '',
    lote: '',
    lote_diluyente: '', // ✅ NUEVO
    lote_jeringa: '', // ✅ NUEVO
    tipo_jeringa: '', // ✅ NUEVO
    via_administracion: '',
    sitio_aplicacion: '',
    fecha_aplicacion: '',
    fecha_proxima_dosis: '',
    responsable: '',
    observaciones: ''
  };

  nombrePaciente: string = '';
  buscandoPaciente: boolean = false;
  pacienteBuscado: boolean = false;
  guardando: boolean = false;

  vacunasDisponibles: string[] = [
    'PFIZER', 'SINOVAC', 'ASTRAZENECA', 'MODERNA 0,25', 'MODERNA 0,5',
    'JANSSEN', 'BCG', 'HEPATITIS B (PEDIÁTRICA)', 'HEPATITIS B ADULTOS',
    'POLIO INACTIVADO (Vacuna inyectable)', 'ANTIPOLIO ORAL (VOP)', 'PENTAVALENTE',
    'HEXAVALENTE', 'DPT', 'DTPa PEDIÁTRICO', 'TD PEDIÁTRICO', 'ROTAVIRUS (Vacuna oral)',
    'NEUMOCOCO 10', 'NEUMOCOCO 13', 'TRIPLE VIRAL', 'SARAMPIÓN - RUBEOLA - SR MULTIDOSIS',
    'FIEBRE AMARILLA', 'HEPATITIS A PEDIÁTRICA', 'HEPATITIS A ADULTO', 'VARICELA',
    'TOXOIDE TETÁNICO Y DIFTÉRICO DE ADULTO', 'DTPa ADULTO', 'INFLUENZA PEDIÁTRICA',
    'INFLUENZA 0,5', 'VPH', 'ANTIRRÁBICA HUMANA INTRAMUSCULAR',
    'SUERO ANTIRRÁBICO HUMANO - MSPS', 'HEPATITIS B (INMUNOGLOBULINA)',
    'ANTITOXINA TETÁNICA DE ORIGEN EQUINO', 'ANTITOXINA DIFTÉRICA DE ORIGEN EQUINO',
    'MENINGOCOCO (Serogrupos A, C, W-135 e Y)'
  ];

  laboratorios: string[] = [
    'Pfizer',
    'Moderna',
    'AstraZeneca',
    'Sinovac',
    'Johnson & Johnson',
    'Sanofi Pasteur',
    'GSK',
    'Merck',
    'Serum Institute of India',
    'Bharat Biotech'
  ];

  tiposJeringa: string[] = [
    'Jeringa Desechable 22G 1/2 Pulg AD',
  'Jeringa Desechable 22G 1/2 Pulg Convencional',
  'Jeringa Desechable 23G 1 Pulg AD',
  'Jeringa Desechable 23G 1 Pulg Convencional',
  'Jeringa Desechable 25G 5/8 Pulg AD',
  'Jeringa Desechable 25G 5/8 Pulg Convencional',
  'Jeringa Desechable 26G 3/8 Pulg AD',
  'Jeringa Desechable 26G 3/8 Pulg Convencional',
  'Jeringa Desechable 27G 3/8 Pulg',
  'Jeringa 23G 1 Pulg Convencional COVID-19',
  'Jeringa 22G 1/2 Pulg Convencional COVID-19'
  ];

  constructor(
    private vacunasService: VacunasService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  buscarPaciente() {
    if (!this.vacuna.numero_id || this.vacuna.numero_id.trim() === '') {
      alert('Por favor ingrese un número de identificación válido.');
      return;
    }

    this.buscandoPaciente = true;
    this.pacienteBuscado = true;

    this.usuariosService.buscarPorIdentificacion(this.vacuna.numero_id).subscribe({
      next: (data) => {
        console.log('👤 Paciente encontrado:', data);
        this.vacuna.usuario_id = data.id;
        this.nombrePaciente = `${data.primer_nombre} ${data.primer_apellido}`;
        this.buscandoPaciente = false;
      },
      error: (err) => {
        console.error('❌ Paciente no encontrado:', err);
        this.nombrePaciente = 'No encontrado';
        this.vacuna.usuario_id = '';
        this.buscandoPaciente = false;
      }
    });
  }

  guardar() {
    if (!this.vacuna.usuario_id) {
      alert('Debe ingresar un paciente válido.');
      return;
    }

    this.guardando = true;

    this.vacunasService.createVacuna(this.vacuna).subscribe({
      next: (response) => {
        console.log('✅ Vacuna guardada:', response);
        alert('✅ Vacuna registrada con éxito');
        this.guardando = false;
        this.router.navigate(['/vacunas']);
      },
      error: (err) => {
        console.error('❌ Error al registrar vacuna:', err);
        alert('Error al registrar vacuna');
        this.guardando = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/vacunas']);
  }
}