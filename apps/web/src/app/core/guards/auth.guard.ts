import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.whenReady;

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
