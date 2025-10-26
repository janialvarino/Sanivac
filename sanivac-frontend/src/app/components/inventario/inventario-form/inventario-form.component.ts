import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../../shared/services/inventario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.css']
})
export class InventarioFormComponent implements OnInit {
  modelo: any = {
    nombre_vacuna: '',
    laboratorio: '', // ✅ NUEVO
    cantidad_total: 0,
    cantidad_disponible: 0,
    fecha_llegada: '',
    fecha_vencimiento: '',
    lote: '',
    lote_diluyente: '', // ✅ NUEVO
    lote_jeringa: '', // ✅ NUEVO
    tipo_jeringa: '',
    observaciones: ''
  };

  guardando = false;
  editId: any = null;

  vacunas: string[] = [
    'PFIZER',
    'SINOVAC',
    'ASTRAZENECA',
    'MODERNA 0,25',
    'MODERNA 0,5',
    'JANSSEN',
    'BCG',
    'HEPATITIS B (PEDIÁTRICA)',
    'HEPATITIS B ADULTOS',
    'POLIO INACTIVADO (Vacuna inyectable)',
    'ANTIPOLIO ORAL (VOP)',
    'PENTAVALENTE',
    'HEXAVALENTE',
    'DPT',
    'DTPa PEDIÁTRICO',
    'TD PEDIÁTRICO',
    'ROTAVIRUS (Vacuna oral)',
    'NEUMOCOCO 10',
    'NEUMOCOCO 13',
    'TRIPLE VIRAL',
    'SARAMPIÓN - RUBEOLA - SR MULTIDOSIS',
    'FIEBRE AMARILLA',
    'HEPATITIS A PEDIÁTRICA',
    'HEPATITIS A ADULTO',
    'VARICELA',
    'TOXOIDE TETÁNICO Y DIFTÉRICO DE ADULTO',
    'DTPa ADULTO',
    'INFLUENZA PEDIÁTRICA',
    'INFLUENZA 0,5',
    'VPH',
    'ANTIRRÁBICA HUMANA INTRAMUSCULAR',
    'SUERO ANTIRRÁBICO HUMANO - MSPS',
    'HEPATITIS B (INMUNOGLOBULINA)',
    'ANTITOXINA TETÁNICA DE ORIGEN EQUINO',
    'ANTITOXINA DIFTÉRICA DE ORIGEN EQUINO',
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

  jeringas: string[] = [
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
    private invSv: InventarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = id;
      this.invSv.getAll().subscribe({
        next: (arr: any) => {
          const found = arr.find((x: any) => x.id == +id);
          if (found) {
            this.modelo = found;
            // Convertir fechas al formato correcto para input type="date"
            if (this.modelo.fecha_llegada) {
              this.modelo.fecha_llegada = this.formatearFecha(this.modelo.fecha_llegada);
            }
            if (this.modelo.fecha_vencimiento) {
              this.modelo.fecha_vencimiento = this.formatearFecha(this.modelo.fecha_vencimiento);
            }
          }
        },
        error: (err) => {
          console.error('Error al cargar registro:', err);
          alert('Error al cargar el registro');
        }
      });
    } else {
      // Al crear nuevo, cantidad_disponible = cantidad_total por defecto
      this.modelo.cantidad_disponible = this.modelo.cantidad_total;
    }
  }

  // Formatear fecha de MySQL a formato input
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Sincronizar cantidad disponible con total al crear nuevo lote
  sincronizarCantidades() {
    if (!this.editId) {
      this.modelo.cantidad_disponible = this.modelo.cantidad_total;
    }
  }

  guardar() {
    // Validaciones
    if (!this.modelo.nombre_vacuna || !this.modelo.lote) {
      alert('⚠️ Por favor complete los campos obligatorios');
      return;
    }

    this.guardando = true;

    if (this.editId) {
      this.invSv.update(this.editId, this.modelo).subscribe({
        next: () => {
          alert('✅ Lote actualizado correctamente');
          this.router.navigate(['/inventario']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('❌ Error al actualizar el lote');
          this.guardando = false;
        }
      });
    } else {
      this.invSv.create(this.modelo).subscribe({
        next: () => {
          alert('✅ Lote registrado correctamente');
          this.router.navigate(['/inventario']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('❌ Error al registrar el lote');
          this.guardando = false;
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/inventario']);
  }
}