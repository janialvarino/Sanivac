import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent {
  inventario = [
    { id:1, vacuna:'COVID-19', stock:200, vencimiento:'2025-12-31' },
    { id:2, vacuna:'Influenza', stock:150, vencimiento:'2025-06-30' }
  ];
}
