import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacunas-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacuna-form.component.html',
  styleUrls: ['./vacuna-form.component.css']
})
export class VacunasFormComponent {
  vacuna: any = { usuario_id: '', nombre_vacuna:'', dosis:'', lote:'', fecha_aplicacion:'', responsable:'', observaciones:'' };

  constructor(private router: Router) {}

  guardar() {
    console.log('guardar vacuna', this.vacuna);
    alert('Vacuna registrada (simulado).');
    this.router.navigate(['/vacunas']);
  }
}

