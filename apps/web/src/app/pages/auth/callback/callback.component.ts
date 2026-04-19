import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  async ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const isNew = this.route.snapshot.queryParamMap.get('new') === '1';

    if (token) {
      this.auth.handleGoogleCallback(token);
      await this.auth.whenReady;
      // New Google users must choose a role first
      const destination = isNew ? '/auth/choose-role' : '/dashboard';
      this.router.navigate([destination], { replaceUrl: true });
    } else {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    }
  }
}
