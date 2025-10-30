import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private api = 'http://localhost:3000/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerReportes(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  descargarExcel(mes: number, anio: number, nombreMes: string): Observable<Blob> {
    return this.http.post(
      `${this.api}/generar-excel`,
      { mes, anio, nombreMes },
      { responseType: 'blob' }
    );
  }
}
