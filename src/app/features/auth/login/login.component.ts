import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

import { AuthService } from '../../../core/services/auth/auth.service';
import { TokenService } from '../../../core/services/auth/token.service';
import { NotificationService } from '../../../core/services/common/notification.service';
import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { campoInvalido } from '@/app/shared/utils/form-utils.component';
import { environment } from '../../../../environments/environment.development';

export interface GoogleCredentialResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, InputTextModule, CheckboxModule, ButtonModule, LogoComponent, PasswordModule, MessageModule, RouterModule
  ],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit, AfterViewInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private notify = inject(NotificationService);

  formularioLogin!: FormGroup;
  loading = false;
  formSubmitted = false;

  campoInvalido = (campo: string) => campoInvalido(this.formularioLogin, campo, this.formSubmitted);

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initGoogleSignIn();
  }

  initForm() {
    this.formularioLogin = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[^@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [false]
    });
  }

  login() {
    this.formSubmitted = true;
    if (this.formularioLogin.invalid) {
      this.notify.showError('Completa correctamente el formulario');
      return;
    }
    this.loading = true;
    this.authService.login(this.formularioLogin.value).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.notify.showSuccess('Bienvenido al sistema');
        this.redirectUser();
      },
      error: (err) => {
        this.notify.showHttpError(err, 'Error de autenticación');
      }
    });
  }

  initGoogleSignIn() {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.renderGoogleButton();
      document.head.appendChild(script);
    } else {
      this.renderGoogleButton();
    }
  }

  renderGoogleButton() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleCredentialResponse.bind(this)
    });

    const googleBtnContainer = document.getElementById("google-button");
    if (googleBtnContainer) {
      google.accounts.id.renderButton(
        googleBtnContainer,
        { theme: "filled_black", size: "large", shape: "rectangular", width: "100%" }
      );
    }
  }

  handleGoogleCredentialResponse(response: GoogleCredentialResponse) {
    this.loading = true;
    this.authService.loginWithGoogle(response.credential).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.notify.showSuccess('Bienvenido al sistema con Google');
        this.redirectUser();
      },
      error: (err) => {
        this.notify.showHttpError(err, 'Error de autenticación con Google');
      }
    });
  }

  private redirectUser() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const home = this.tokenService.getHomeByRole();
    this.router.navigateByUrl(returnUrl || home, { replaceUrl: true });
  }
}