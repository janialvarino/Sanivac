import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AntecedentesMedicosService {
  private api = 'http://localhost:3000/api/antecedentes-medicos';

  constructor(private http: HttpClient) {}

  getByUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/usuario/${usuarioId}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  createMultiple(data: any[]): Observable<any> {
    return this.http.post(`${this.api}/multiple`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}