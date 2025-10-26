import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = 'http://localhost:3000/api/reportes';

  constructor(private http: HttpClient) {}

  // ✅ Obtener reportes por mes y año
  obtenerPorMesAnio(mes: number, anio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?mes=${mes}&anio=${anio}`);
  }

  // ✅ Descargar Excel
  descargarExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar-template`, { responseType: 'blob' });

  }
}

