import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacunasService {
  private apiUrl = 'http://localhost:3000/api/vacunas'; // Asegúrate de usar el puerto correcto

  constructor(private http: HttpClient) {}

  // Obtener todas las vacunas
  getVacunas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener vacunas por usuario
  getVacunasPorUsuario(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${id}`);
  }

  // Obtener vacuna por ID
  getVacunaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva vacuna
  createVacuna(vacuna: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, vacuna);
  }

  // Actualizar vacuna
  actualizarVacuna(id: number, vacuna: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, vacuna);
  }

  // Eliminar vacuna
  eliminarVacuna(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
