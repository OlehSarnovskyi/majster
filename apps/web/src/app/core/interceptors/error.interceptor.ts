import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

const ERROR_TRANSLATIONS: Record<string, string> = {
  'Internal server error': 'Interná chyba servera',
  'Unauthorized': 'Neautorizovaný prístup',
  'Forbidden': 'Prístup zamietnutý',
  'Not Found': 'Nenájdené',
  'Bad Request': 'Neplatná požiadavka',
  'User already exists': 'Používateľ s týmto e-mailom už existuje',
  'Invalid credentials': 'Nesprávny e-mail alebo heslo',
  'Service not found': 'Služba nebola nájdená',
  'Master not found': 'Majster nebol nájdený',
  'Booking not found': 'Rezervácia nebola nájdená',
  'You can only update your own services': 'Môžete upravovať len vlastné služby',
  'You can only delete your own services': 'Môžete mazať len vlastné služby',
};

function translateError(msg: string): string {
  if (ERROR_TRANSLATIONS[msg]) return ERROR_TRANSLATIONS[msg];

  // Translate class-validator messages
  if (msg.includes('must be')) return 'Neplatná hodnota v jednom z polí';
  if (msg.includes('should not be empty')) return 'Vyplňte všetky povinné polia';

  return msg;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {
      let message =
        err.error?.message ||
        err.error?.error ||
        'Nastala neočakávaná chyba';

      if (Array.isArray(message)) {
        message = message.map(translateError).join('. ');
      } else {
        message = translateError(message);
      }

      // Don't show toast for auth check (GET /api/auth/me) — silent fail
      if (!(req.method === 'GET' && req.url.includes('/auth/me'))) {
        toast.error(message);
      }

      return throwError(() => err);
    })
  );
};
