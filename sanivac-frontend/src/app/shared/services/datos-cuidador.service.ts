import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosCuidadorService {
  private api = 'http://localhost:3000/api/datos-cuidador';

  constructor(private http: HttpClient) {}

  getByUsuario(usuarioId: number): Observable<any> {
    // ✅ CAMBIO: Quitar /usuario/
    return this.http.get<any>(`${this.api}/${usuarioId}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}