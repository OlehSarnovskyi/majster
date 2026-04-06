import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check token directly — signal may not be hydrated yet
  if (!localStorage.getItem('accessToken')) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
