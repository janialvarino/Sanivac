import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlarmasService {
  private apiUrl = 'http://localhost:3000/api/alarmas';

  constructor(private http: HttpClient) {}

  obtenerAlarmas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerPendientesCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pendientes/count`);
  }

  // ✅ CORREGIDO: Usar la misma ruta que en el backend
  marcarAtendida(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/atender`, {});
  }
}
