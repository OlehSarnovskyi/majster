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

    if (token) {
      this.auth.handleGoogleCallback(token);
      await this.auth.whenReady;
      // Redirect to choose-role if user hasn't chosen yet (new OR returning without choosing)
      const user = this.auth.user();
      const destination = user && !user.roleChosen ? '/auth/choose-role' : '/dashboard';
      this.router.navigate([destination], { replaceUrl: true });
    } else {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    }
  }
}
