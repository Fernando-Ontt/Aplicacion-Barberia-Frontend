import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { environment } from '@/environments/environment.development';

@Component({
  selector: 'app-registrar-barbero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registrar-barbero.html',
  styleUrl: './registrar-barbero.css',
})
export class RegistrarBarbero {
  form: FormGroup;
  showConfirm = false;
  isSubmitting = false;
  showPassword = false;
  showPasswordConfirm = false;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private notification: NotificationService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],

      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],

      experiencia: [0],
      fechaIngreso: [new Date().toISOString().slice(0,10)],
      sueldo: [''],
      comision: ['']
    });
  }

  get f() { return this.form.controls; }

  togglePassword() { this.showPassword = !this.showPassword; }
  togglePasswordConfirm() { this.showPasswordConfirm = !this.showPasswordConfirm; }

  submit(): void {
    if (this.form.invalid) return;
    this.openConfirm();
  }

  openConfirm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const pwd = this.form.get('password')?.value;
    const pwdConfirm = this.form.get('passwordConfirm')?.value;
    if (pwd !== pwdConfirm) {
      this.form.get('passwordConfirm')?.setErrors({ mismatch: true });
      return;
    }
    this.showConfirm = true;
  }

  closeConfirm(): void { this.showConfirm = false; this.isSubmitting = false; }

  submitConfirmed(): void {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const v = this.form.value;
    const payload = {
      persona: {
        nombre: v.nombre,
        apellido: v.apellido,
        telefono: v.telefono,
        email: v.email
      },
      usuario: {
        usuario: v.usuario,
        password: v.password
      },
      barbero: {
        experiencia: Number(v.experiencia) || 0,
        fecha_ingreso: v.fechaIngreso,
        sueldo: v.sueldo ? Number(v.sueldo) : null,
        comision: v.comision ? Number(v.comision) : null
      }
    };

    this.http.post<any>(`${environment.apiUrl}/barberos`, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.showConfirm = false;
        this.notification.showSuccess(res?.message || 'Barbero creado correctamente');
        this.router.navigate(['/dashboard/gestion/barberos']);
      },
      error: (err) => {
        console.error('Error crear barbero', err);
        this.isSubmitting = false;
        this.showConfirm = false;
        this.notification.showHttpError(err, 'Crear barbero');
      }
    });
  }
}
