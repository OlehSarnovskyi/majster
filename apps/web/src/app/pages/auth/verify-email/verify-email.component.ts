import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  loading = signal(true);
  success = signal(false);
  error = signal('');

  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error.set('Neplatný overovací odkaz.');
      this.loading.set(false);
      return;
    }

    this.auth.verifyEmail(token).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Odkaz vypršal alebo je neplatný.');
        this.loading.set(false);
      },
    });
  }
}
