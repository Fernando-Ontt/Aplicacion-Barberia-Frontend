import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@/environments/environment.development';
import { FilaSemanal } from '../../models/analisis/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {

  private http = inject(HttpClient);
private base = `${environment.apiUrl}/reportes`;

private diasMap: Record<string, string> = {
  'Monday':    'Lunes',
  'Tuesday':   'Martes',
  'Wednesday': 'Miércoles',
  'Thursday':  'Jueves',
  'Friday':    'Viernes',
  'Saturday':  'Sábado',
  'Sunday':    'Domingo',
};

getResumenSemanal(desde: string, hasta: string): Observable<FilaSemanal[]> {
  return this.http
    .get<{ data: FilaSemanal[] }>(`${this.base}/resumen-semanal`, {
      params: { desde, hasta }
    })
    .pipe(map(r => r.data.map(f => ({
      ...f,
      dia: this.diasMap[f.dia] ?? f.dia
    }))));
}

descargarArchivo(tipo: string, formato: string, desde: string, hasta: string): Observable<Blob> {
  return this.http.get(`${this.base}/${tipo}/${formato}`, {
    params: { desde, hasta },
    responseType: 'blob'
  });
}
}

