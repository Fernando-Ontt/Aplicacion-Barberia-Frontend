import { Component, inject } from '@angular/core';
import { LoginRequest } from '../../models/LoginRequest';
import { AuthService } from '../../../../core/services/auth/auth';
import { Token } from '../../../../core/services/token/token';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private route = inject(ActivatedRoute);

  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };

  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenService: Token,
    private router: Router
  ) { }

  login() {

    this.loading = true;

    this.authService.login(this.loginRequest)
      .subscribe({

        next: () => {

          const returnUrl = this.route.snapshot.queryParams['returnUrl'];

          const home = this.tokenService.getHomeByRole();

          this.router.navigate([returnUrl || home], {
            replaceUrl: true
          });

          this.loading = false;



        },

        error: () => {
          this.errorMessage = "Credenciales incorrectas";

          this.loading = false;
        }

      });

  }
}
