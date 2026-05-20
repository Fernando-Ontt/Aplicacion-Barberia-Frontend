import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ClienteRegister } from '../../models/auth/usuario/cliente-register.model';
import { ResetPasswordRequest } from '../../models/auth/usuario/reset-password-request.model';
import { UpdateUsernameRequest } from '../../models/auth/usuario/update-username-request.model';
import { BarberoRegister } from '../../models/auth/usuario/barbero-register.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/usuarios`;

    registrarCliente(data: ClienteRegister): Observable<any> {
        const payload = { ...data, idRol: 3 } as ClienteRegister;
        return this.http.post<any>(
            `${this.apiUrl}/cliente`,
            payload
        );
    }

    registrarBarbero(data: BarberoRegister): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/barbero`,
            data
        );
    }

    resetPassword(idUsuario: number, data: ResetPasswordRequest): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}/${idUsuario}/reset-password`,
            data
        );
    }

    updateUsername(idUsuario: number, data: UpdateUsernameRequest): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/${idUsuario}/username-update`,
            data
        );
    }
}