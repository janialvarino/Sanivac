import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EsquemaVacunacion } from '../models/esquema-vacunacion.model';

@Injectable({
  providedIn: 'root'
})
export class EsquemaVacunacionService {
  private apiUrl = 'http://localhost:3000/api/esquema-vacunacion';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EsquemaVacunacion[]> {
    return this.http.get<EsquemaVacunacion[]>(this.apiUrl);
  }

  getById(id: number): Observable<EsquemaVacunacion> {
    return this.http.get<EsquemaVacunacion>(`${this.apiUrl}/${id}`);
  }

  getByPaciente(id: number): Observable<EsquemaVacunacion[]> {
    return this.http.get<EsquemaVacunacion[]>(`${this.apiUrl}/paciente/${id}`);
  }

  create(data: EsquemaVacunacion): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: EsquemaVacunacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
