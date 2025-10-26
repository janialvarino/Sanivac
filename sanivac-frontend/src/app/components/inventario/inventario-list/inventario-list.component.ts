import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { InventarioService } from '../../../shared/services/inventario.service';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.css']
})
export class InventarioListComponent implements OnInit {
  inventario: any[] = [];

  constructor(
    private invSv: InventarioService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarInventario();
  }

  cargarInventario() {
    this.invSv.getAll().subscribe({
      next: (data: any) => {
        this.inventario = data;
        console.log('📦 Inventario cargado:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar inventario:', err);
        alert('Error al cargar el inventario');
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/inventario/form', id]);
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este lote del inventario?')) {
      this.invSv.delete(id).subscribe({
        next: () => {
          alert('✅ Lote eliminado correctamente');
          this.cargarInventario();
        },
        error: (err) => {
          console.error('❌ Error al eliminar:', err);
          alert('Error al eliminar el lote');
        }
      });
    }
  }

  nuevoLote() {
    this.router.navigate(['/inventario/form']);
  }

  // ⚠️ Verificar si está próximo a vencer (30 días)
  esProximoAVencer(fechaVencimiento: string): boolean {
    if (!fechaVencimiento) return false;
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diasDiferencia = Math.floor((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasDiferencia <= 30 && diasDiferencia >= 0;
  }
}