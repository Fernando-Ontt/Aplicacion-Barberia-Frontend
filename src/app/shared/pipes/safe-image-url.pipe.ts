import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Pipe({
    name: 'safeImageUrl',
    pure: false
})
export class SafeImageUrlPipe implements PipeTransform {
    apiBaseUrl = environment.apiBaseUrl;

    transform(url: string | null | undefined): string | undefined {
        if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {return undefined;}
        if (/^https?:\/\//i.test(url) && !url.includes('localhost:4200')) {return url;}
        if (url.startsWith('/uploads') || url.startsWith('uploads')) {return this.apiBaseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');}
        if (url.includes('localhost:4200/uploads')) {return url.replace('localhost:4200', this.apiBaseUrl.replace(/\/$/, ''));}
        if (/^[a-zA-Z0-9\-]+\.\w+$/.test(url)) {return this.apiBaseUrl.replace(/\/$/, '') + '/uploads/categorias/' + url;}
        return undefined;
    }
}
