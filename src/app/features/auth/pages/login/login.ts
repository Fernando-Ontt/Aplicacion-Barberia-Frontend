import { Component } from '@angular/core';
import { LoginRequest } from '../../models/LoginRequest';
import { AuthService } from '../../../../core/services/auth/auth';
import { Token } from '../../../../core/services/token/token';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

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
  ) {}

 login(){

  this.loading = true;

  this.authService.login(this.loginRequest)
    .subscribe({

      next: () => {

        if(this.tokenService.getRoles().includes('ROLE_cliente')){
          this.router.navigate(['/app']);
          
        }else{
          this.router.navigate(['/dashboard']);
          console.log(this.tokenService.getRoles());
        }

       

      },

      error: () => {
        this.errorMessage = "Credenciales incorrectas";
        
        this.loading = false;
      }

    });

  }
}
