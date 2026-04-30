import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  submitted = false;

  justRegistered = signal(false);
  emailNotVerified = signal(false);
  resendLoading = signal(false);
  resendSent = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('registered') === '1') {
      this.justRegistered.set(true);
      const email = params.get('email');
      if (email) this.email = email;
    }
  }

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
    this.emailNotVerified.set(false);
    this.resendSent.set(false);
    this.loading.set(true);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        const destination = res.user.roleChosen ? '/dashboard' : '/auth/choose-role';
        this.router.navigate([destination]);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.error?.message === 'E-mail nie je overený') {
          this.emailNotVerified.set(true);
        } else {
          this.error.set(err.error?.message === 'Invalid credentials'
            ? 'Nesprávny e-mail alebo heslo'
            : 'Prihlásenie zlyhalo');
        }
      },
    });
  }

  resendVerification() {
    this.resendLoading.set(true);
    this.auth.resendVerificationByEmail(this.email).subscribe({
      next: () => {
        this.resendSent.set(true);
        this.resendLoading.set(false);
      },
      error: () => {
        this.resendLoading.set(false);
      },
    });
  }
}
