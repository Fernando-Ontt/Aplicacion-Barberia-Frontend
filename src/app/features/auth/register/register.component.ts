import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from 'primeng/password';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';

// ─── Validadores personalizados ───────────────────────────────────────────────

const soloLetrasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value ?? '';
  return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(valor.trim()) ? null : { soloLetras: true };
};

const telefonoPeruanoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = (control.value ?? '').replace(/\s/g, '');
  return /^(\+?51)?9\d{8}$/.test(valor) ? null : { telefonoInvalido: true };
};

const usernameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value ?? '';
  if (/\s/.test(valor)) return { sinEspacios: true };
  return /^[a-zA-Z0-9._]+$/.test(valor) ? null : { usernameInvalido: true };
};


const passwordSeguraValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value ?? '';
  const errores: ValidationErrors = {};
  if (valor.length < 8)          errores['minLength']    = true;
  if (!/[A-Z]/.test(valor))      errores['sinMayuscula'] = true;
  if (!/[0-9]/.test(valor))      errores['sinNumero']    = true;
  if (!/[^a-zA-Z0-9]/.test(valor)) errores['sinSimbolo'] = true;
  return Object.keys(errores).length ? errores : null;
};

const passwordsIgualesValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd     = group.get('password')?.value;
  const confirm = group.get('passwordConfirm')?.value;
  return pwd && confirm && pwd !== confirm ? { passwordsNoCoinciden: true } : null;
};

const gmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = (control.value ?? '').trim().toLowerCase();

  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(valor)
    ? null
    : { gmailInvalido: true };
};


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    LogoComponent, InputTextModule, MessageModule, CheckboxModule,
    PasswordModule, ReactiveFormsModule, RouterLink, ButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  errorMsg  = '';
  loading   = false;
  submitted = false;

  registerForm = this.fb.group(
    {
      nombre:          ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
      apellido:        ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
      telefono:        ['', [Validators.required, telefonoPeruanoValidator]],
      email: ['', [ Validators.required, Validators.email, gmailValidator ]],
      username:        ['', [Validators.required, Validators.minLength(4), usernameValidator]],
      password:        ['', [Validators.required, passwordSeguraValidator]],
      passwordConfirm: ['', [Validators.required]],
      terminos:        [false, [Validators.requiredTrue]],
    },
    { validators: passwordsIgualesValidator }   
  );


  get passwordCtrl()        { return this.registerForm.get('password'); }
  get passwordConfirmCtrl() { return this.registerForm.get('passwordConfirm'); }

  isInvalid(campo: string): boolean {
    return campoInvalido(this.registerForm, campo, this.submitted);
  }

  /** Mensajes descriptivos para la contraseña */
  get passwordError(): string {
    const e = this.passwordCtrl?.errors;
    if (!e) return '';
    if (e['minLength'])    return 'Debe tener al menos 8 caracteres';
    if (e['sinMayuscula']) return 'Debe incluir al menos una mayúscula';
    if (e['sinNumero'])    return 'Debe incluir al menos un número';
    if (e['sinSimbolo'])   return 'Debe incluir al menos un símbolo (ej. @, #, !)';
    return 'Contraseña inválida';
  }

  get confirmError(): string {
    if (this.passwordConfirmCtrl?.errors?.['required']) return 'Confirma tu contraseña';
    if (this.registerForm.errors?.['passwordsNoCoinciden'] && this.submitted) return 'Las contraseñas no coinciden';
    return '';
  }

  onSubmit(): void {
    this.submitted = true;
    marcarFormulario(this.registerForm);

    if (this.registerForm.invalid) return;

    const { email, password, nombre, apellido, telefono, username } = this.registerForm.value;

    const payload = {
      username: username!,
      password: password!,
      idRol:    3,
      nombre:   nombre!,
      apellido: apellido!,
      telefono: telefono!,
      email:    email!,
    };

    this.loading  = true;
    this.errorMsg = '';

    this.authService.register(payload).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        // El backend avisa si el email ya existe
        const msg: string = err.error?.message ?? '';
        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('correo')) {
          this.registerForm.get('email')?.setErrors({ emailDuplicado: true });
          this.errorMsg = 'Este correo ya está registrado. Inicia sesión o usa otro.';
        } else {
          this.errorMsg = msg || 'Error al registrarse. Intenta de nuevo.';
        }
        this.loading = false;
      },
    });
  }
}
