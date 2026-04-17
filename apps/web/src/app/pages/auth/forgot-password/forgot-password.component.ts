import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email = '';
  submitted = false;
  loading = signal(false);
  success = signal(false);
  error = signal('');

  private auth = inject(AuthService);

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email) return 'E-mail je povinný';
    if (!this.email.includes('@')) return 'Zadajte platný e-mail';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.emailError) return;

    this.error.set('');
    this.loading.set(true);

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nastala chyba. Skúste to znova.');
        this.loading.set(false);
      },
    });
  }
}
