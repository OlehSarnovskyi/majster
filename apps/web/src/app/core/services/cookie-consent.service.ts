import { Injectable, signal } from '@angular/core';

export type ConsentChoice = 'all' | 'necessary' | null;

const CONSENT_KEY = 'cookie_consent';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  showBanner = signal(false);
  consent = signal<ConsentChoice>(null);

  constructor() {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'all' || stored === 'necessary') {
      this.consent.set(stored);
    } else {
      this.showBanner.set(true);
    }
  }

  acceptAll() {
    this.consent.set('all');
    localStorage.setItem(CONSENT_KEY, 'all');
    this.showBanner.set(false);
  }

  acceptNecessary() {
    this.consent.set('necessary');
    localStorage.setItem(CONSENT_KEY, 'necessary');
    this.showBanner.set(false);
  }
}
