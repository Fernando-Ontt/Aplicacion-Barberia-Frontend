export interface FilaSemanal {
  dia: string;
  reservas: number;
  completadas: number;
  canceladas: number;
  ingresos: number;
}

export interface ReporteItem {
  icon: string;
  titulo: string;
  descripcion: string;
  tipo: string;
}