import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: '<div class="auth-page"><p>Prihlasovanie...</p></div>',
  styles: ['.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }'],
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private http = inject(HttpClient);

  async ngOnInit() {
    const isNew = this.route.snapshot.queryParamMap.get('new') === '1';

    try {
      const { token } = await this.http
        .get<{ token: string }>('/api/auth/session', { withCredentials: true })
        .toPromise() as { token: string };

      this.auth.handleGoogleCallback(token);
      await this.auth.whenReady;
      const user = this.auth.user();
      const destination = (isNew || (user && !user.roleChosen)) ? '/auth/choose-role' : '/dashboard';
      this.router.navigate([destination], { replaceUrl: true });
    } catch {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    }
  }
}
