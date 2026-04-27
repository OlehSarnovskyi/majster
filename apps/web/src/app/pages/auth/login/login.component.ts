import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  submitted = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email) return 'E-mail je povinný';
    if (!this.email.includes('@')) return 'Zadajte platný e-mail';
    return '';
  }

  get passwordError(): string {
    if (!this.submitted) return '';
    if (!this.password) return 'Heslo je povinné';
    return '';
  }

  onSubmit() {
    this.submitted = true;
    if (this.emailError || this.passwordError) return;

    this.error.set('');
    this.loading.set(true);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        const destination = res.user.roleChosen ? '/dashboard' : '/auth/choose-role';
        this.router.navigate([destination]);
      },
      error: (err) => {
        this.error.set(err.error?.message === 'Invalid credentials'
          ? 'Nesprávny e-mail alebo heslo'
          : 'Prihlásenie zlyhalo');
        this.loading.set(false);
      },
    });
  }
}
