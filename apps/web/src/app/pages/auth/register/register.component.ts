import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  gdprConsent = false;
  error = signal('');
  loading = signal(false);
  submitted = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  get firstNameError(): string {
    if (!this.submitted) return '';
    if (!this.firstName) return 'Meno je povinné';
    if (this.firstName.length < 2) return 'Minimálne 2 znaky';
    return '';
  }

  get lastNameError(): string {
    if (!this.submitted) return '';
    if (!this.lastName) return 'Priezvisko je povinné';
    if (this.lastName.length < 2) return 'Minimálne 2 znaky';
    return '';
  }

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email) return 'E-mail je povinný';
    if (!this.email.includes('@') || !this.email.includes('.')) return 'Zadajte platný e-mail';
    return '';
  }

  get passwordError(): string {
    if (!this.submitted) return '';
    if (!this.password) return 'Heslo je povinné';
    if (this.password.length < 6) return 'Minimálne 6 znakov';
    return '';
  }

  get isValid(): boolean {
    return (
      this.firstName.length >= 2 &&
      this.lastName.length >= 2 &&
      this.email.includes('@') &&
      this.password.length >= 6 &&
      this.gdprConsent
    );
  }

  onSubmit() {
    this.submitted = true;
    if (!this.isValid) return;

    this.error.set('');
    this.loading.set(true);

    this.auth
      .register({
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/choose-role']);
        },
        error: (err) => {
          const msg = err.error?.message;
          this.error.set(
            msg === 'User already exists'
              ? 'Používateľ s týmto e-mailom už existuje'
              : 'Registrácia zlyhala'
          );
          this.loading.set(false);
        },
      });
  }
}
