import { Component, inject } from '@angular/core';
import { ServerStatusService } from '../../core/services/server-status.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-maintenance-banner',
  standalone: true,
  templateUrl: './maintenance-banner.component.html',
  styleUrl: './maintenance-banner.component.scss',
})
export class MaintenanceBannerComponent {
  serverStatus = inject(ServerStatusService);
  private auth = inject(AuthService);

  retry() {
    this.auth.ping().subscribe({
      next: () => this.serverStatus.markUp(),
      error: (err) => {
        if (err.status !== 0 && err.status !== 502 && err.status !== 503) {
          // Backend is up (returned a real response, even 401/403 is fine)
          this.serverStatus.markUp();
        }
      },
    });
  }
}
