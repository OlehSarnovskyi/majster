import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  passwordConfirm = '';
  submitted = false;
  loading = signal(false);
  success = signal(false);
  error = signal('');
  token = '';

  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.error.set('Neplatný odkaz na obnovenie hesla.');
    }
  }

  get passwordError(): string {
    if (!this.submitted) return '';
    if (!this.password) return 'Heslo je povinné';
    if (this.password.length < 8) return 'Heslo musí mať aspoň 8 znakov';
    return '';
  }

  get confirmError(): string {
    if (!this.submitted) return '';
    if (!this.passwordConfirm) return 'Potvrďte heslo';
    if (this.password !== this.passwordConfirm) return 'Heslá sa nezhodujú';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.passwordError || this.confirmError || !this.token) return;

    this.error.set('');
    this.loading.set(true);

    this.auth.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        this.error.set(
          err.error?.message === 'Invalid or expired reset token'
            ? 'Odkaz vypršal alebo je neplatný. Požiadajte o nový.'
            : 'Nastala chyba. Skúste to znova.'
        );
        this.loading.set(false);
      },
    });
  }
}
