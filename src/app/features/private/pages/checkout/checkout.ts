import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ReservaService } from '@/app/core/services/operaciones/reserva.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reservaService = inject(ReservaService);

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  reservaId = Number(
    this.route.snapshot.paramMap.get('reservaId')
  );

  loading = false;

  form = this.fb.group({
    titular: ['', [Validators.required]],
    numeroTarjeta: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{16}$/)
      ]
    ],
    expiracion: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
      ]
    ],
    cvv: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{3,4}$/)
      ]
    ]
  });

  confirmarPago(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Completa todos los campos.'
      });

      return;
    }

    this.confirmationService.confirm({
      header: 'Confirmar pago',
      message: '¿Deseas procesar el pago de esta reserva?',
      icon: 'pi pi-credit-card',
      acceptLabel: 'Pagar',
      rejectLabel: 'Cancelar',

      accept: () => this.pagar()
    });
  }

  pagar(): void {

    this.loading = true;

    this.reservaService
      .pagarReserva(this.reservaId)
      .subscribe({
        next: (response) => {

          this.messageService.add({
            severity: 'success',
            summary: 'Pago realizado',
            detail: response.message
          });

          setTimeout(() => {
            this.router.navigate([
              '/mi-cuenta/reservas/mis-reservas'
            ]);
          }, 1500);
        },
        error: () => {

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo procesar el pago.'
          });

          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  volver(): void {
    this.router.navigate([
      '/mi-cuenta/reservas/mis-reservas'
    ]);
  }
}