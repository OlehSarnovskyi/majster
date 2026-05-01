import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  saving = signal(false);
  saved = signal(false);
  error = signal('');
  uploadingAvatar = signal(false);
  avatarPreview = signal<string | null>(null);

  firstName = '';
  lastName = '';
  phone = '';
  bio = '';

  auth = inject(AuthService);
  private seo = inject(SeoService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService);

  constructor() {
    const u = this.auth.user();
    if (u) {
      this.firstName = u.firstName;
      this.lastName = u.lastName;
      this.phone = u.phone || '';
      this.bio = u.bio || '';
      if (u.avatar) {
        this.avatarPreview.set(u.avatar);
      }
    }
  }

  ngOnInit() {
    this.seo.setPage('Upraviť profil');
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      this.toast.error('Povolené sú iba JPEG, PNG a WebP obrázky');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toast.error('Maximálna veľkosť súboru je 5 MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    this.uploadingAvatar.set(true);
    this.auth.uploadAvatar(file).subscribe({
      next: () => {
        this.uploadingAvatar.set(false);
        this.toast.success('Fotka profilu bola aktualizovaná');
      },
      error: () => {
        this.uploadingAvatar.set(false);
        this.avatarPreview.set(this.auth.user()?.avatar || null);
      },
    });
  }

  private readonly PHONE_REGEX = /^\+?[\d\s\-\(\)]{9,20}$/;

  get phoneError(): string {
    const trimmed = this.phone.trim();
    if (!trimmed) {
      return this.auth.isMaster() ? 'Telefón je povinný pre majstrov' : '';
    }
    if (!this.PHONE_REGEX.test(trimmed)) {
      return 'Zadajte platný formát (napr. +421 900 123 456)';
    }
    return '';
  }

  get canSave(): boolean {
    return (
      this.firstName.length >= 2 &&
      this.lastName.length >= 2 &&
      this.phoneError === ''
    );
  }

  save() {
    if (!this.canSave) return;
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
          this.error.set(err.error?.message || 'Nepodarilo sa aktualizovať profil');
          this.saving.set(false);
        },
      });
  }

  async deleteAccount() {
    const confirmed = await this.confirm.confirm({
      title: 'Vymazať účet',
      message:
        'Naozaj chcete vymazať svoj účet? Všetky vaše údaje, rezervácie a služby budú nenávratne vymazané.',
      confirmText: 'Vymazať účet',
      cancelText: 'Zrušiť',
      danger: true,
    });

    if (confirmed) {
      this.auth.deleteAccount().subscribe({
        next: () => {
          this.toast.success('Váš účet bol vymazaný');
          this.auth.logout();
        },
      });
    }
  }
}
