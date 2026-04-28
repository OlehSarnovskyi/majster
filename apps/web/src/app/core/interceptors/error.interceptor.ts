import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ServerStatusService } from '../services/server-status.service';

const ERROR_TRANSLATIONS: Record<string, string> = {
  // Auth
  'Unauthorized': 'Neautorizovaný prístup',
  'Forbidden': 'Prístup zamietnutý',
  'Invalid credentials': 'Nesprávny e-mail alebo heslo',
  'User already exists': 'Používateľ s týmto e-mailom už existuje',
  'User with this email already exists': 'Používateľ s týmto e-mailom už existuje',
  'Role already set': 'Rola je už nastavená',
  'Email already verified': 'E-mail je už overený',
  'Invalid or expired verification token': 'Neplatný alebo expirovaný overovací odkaz',
  'Invalid or expired reset token': 'Neplatný alebo expirovaný odkaz na obnovu hesla',
  // Services & bookings
  'Service not found': 'Služba nebola nájdená',
  'Master not found': 'Majster nebol nájdený',
  'Booking not found': 'Rezervácia nebola nájdená',
  'Booking time must be in the future': 'Čas rezervácie musí byť v budúcnosti',
  'You can only update your own services': 'Môžete upravovať len vlastné služby',
  'You can only delete your own services': 'Môžete mazať len vlastné služby',
  // Generic HTTP
  'Not Found': 'Požadovaná stránka nebola nájdená',
  'Bad Request': 'Neplatná požiadavka',
  'Internal server error': 'Interná chyba servera. Skúste neskôr',
  'Internal Server Error': 'Interná chyba servera. Skúste neskôr',
  'Too Many Requests': 'Príliš veľa pokusov. Skúste to neskôr',
};

// HTTP status code → Slovak message (fallback when no body message)
const STATUS_TRANSLATIONS: Record<number, string> = {
  401: 'Prihláste sa prosím',
  403: 'Nemáte oprávnenie na túto akciu',
  404: 'Požadovaná stránka nebola nájdená',
  409: 'Konflikt — daný záznam už existuje',
  422: 'Neplatné údaje vo formulári',
  429: 'Príliš veľa pokusov. Skúste to o chvíľu',
  500: 'Chyba servera. Skúste neskôr',
  502: 'Server je dočasne nedostupný',
  503: 'Služba je dočasne nedostupná',
};

function translateError(msg: string): string {
  if (ERROR_TRANSLATIONS[msg]) return ERROR_TRANSLATIONS[msg];
  // class-validator messages
  if (msg.includes('must be an email')) return 'Zadajte platný e-mail';
  if (msg.includes('must be')) return 'Neplatná hodnota v jednom z polí';
  if (msg.includes('should not be empty')) return 'Vyplňte všetky povinné polia';
  if (msg.includes('minimum length')) return 'Heslo musí mať aspoň 8 znakov';
  if (msg.includes('at least')) return 'Minimálna dĺžka nie je splnená';
  return msg;
}

const SERVER_DOWN_STATUSES = new Set([0, 502, 503]);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const serverStatus = inject(ServerStatusService);

  return next(req).pipe(
    tap(() => serverStatus.markUp()),
    catchError((err) => {
      if (SERVER_DOWN_STATUSES.has(err.status)) {
        serverStatus.markDown();
        return throwError(() => err);
      }

      serverStatus.markUp();

      // Don't show toast for auth check (GET /api/auth/me) — silent fail
      const isSilent = req.method === 'GET' && req.url.includes('/auth/me');

      if (!isSilent) {
        let message: string;

        // Try to get message from response body
        const rawMessage = err.error?.message || err.error?.error;

        if (rawMessage) {
          if (Array.isArray(rawMessage)) {
            message = rawMessage.map(translateError).join('. ');
          } else {
            message = translateError(rawMessage);
          }
        } else {
          // Fall back to HTTP status code translation
          message = STATUS_TRANSLATIONS[err.status] ?? 'Nastala neočakávaná chyba';
        }

        toast.error(message);
      }

      return throwError(() => err);
    })
  );
};
