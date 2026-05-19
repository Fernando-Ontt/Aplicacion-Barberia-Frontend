import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from 'primeng/password';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [LogoComponent, InputTextModule, CheckboxModule, PasswordModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  
  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
    terminos: [false, [Validators.requiredTrue]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
      // Aquí va la lógica para enviar los datos al servidor
    }
  }
}
