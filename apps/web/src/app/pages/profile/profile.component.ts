import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  saving = signal(false);
  saved = signal(false);
  error = signal('');

  firstName = '';
  lastName = '';
  phone = '';
  bio = '';

  constructor(public auth: AuthService) {
    const u = this.auth.user();
    if (u) {
      this.firstName = u.firstName;
      this.lastName = u.lastName;
      this.phone = u.phone || '';
      this.bio = u.bio || '';
    }
  }

  save() {
    this.saving.set(true);
    this.saved.set(false);
    this.error.set('');

    this.auth
      .updateProfile({
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone || undefined,
        bio: this.bio || undefined,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.saved.set(true);
          setTimeout(() => this.saved.set(false), 3000);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to update profile');
          this.saving.set(false);
        },
      });
  }
}
