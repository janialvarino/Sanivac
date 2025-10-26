export interface EsquemaVacunacion {
  id?: number;
  usuario_id?: number;
  tipo_carnet: string;
  observaciones?: string | null;
  fecha_registro?: string;
}
