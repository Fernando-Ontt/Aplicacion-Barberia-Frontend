import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  crearPrevisualizacion(file: File): string {
    return URL.createObjectURL(file);
  }

  obtenerReadableSize(file: File): string {
    return `${(file.size / 1024).toFixed(2)} KB`;
  }

  imagenValida(file: File, maxSize = 10_000_0000): boolean {
    return file.type.startsWith('image/') && file.size <= maxSize;
  }

  obtenerImagenProtegida(imagenUrl: string) {
    let url = this.baseUrl + imagenUrl;
    if (!/^https?:\/\//i.test(imagenUrl)) { url = this.baseUrl.replace(/\/$/, '') + '/' + imagenUrl.replace(/^\//, ''); }
    return this.http.get(url, { responseType: 'blob' });
  }

  crearPrevisualizaciones(files: File[]): string[] {
    return files.map(file => this.crearPrevisualizacion(file));
  }

  obtenerReadableSizes(files: File[]): string[] {
    return files.map(file => this.obtenerReadableSize(file));
  }

  imagenesValidas(files: File[], maxSize = 10_000_0000): File[] {
    return files.filter(file => this.imagenValida(file, maxSize));
  }
}
