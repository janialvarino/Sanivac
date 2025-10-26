import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class InventarioService {
  private api = 'http://localhost:3000/api/inventario';
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<any[]>(this.api); }
  getResumen() { return this.http.get<any>(`${this.api}/resumen`); }
  create(data: any) { return this.http.post(this.api, data); }
  update(id: any, data: any) { return this.http.put(`${this.api}/${id}`, data); }
  delete(id: any) { return this.http.delete(`${this.api}/${id}`); }
}
