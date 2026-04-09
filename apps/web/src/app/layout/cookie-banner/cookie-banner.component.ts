import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (consent.showBanner()) {
      <div class="cookie-banner">
        <div class="cookie-banner__content">
          <p>
            Táto stránka používa cookies na zabezpečenie základnej funkčnosti a zlepšenie vášho zážitku.
            Viac informácií nájdete v našich
            <a routerLink="/cookies">Zásadách používania cookies</a>.
          </p>
          <div class="cookie-banner__actions">
            <button class="btn btn--ghost btn--sm" (click)="consent.acceptNecessary()">
              Iba nevyhnutné
            </button>
            <button class="btn btn--primary btn--sm" (click)="consent.acceptAll()">
              Prijať všetky
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1500;
      background: white;
      border-top: 1px solid var(--color-border);
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
      padding: 16px 24px;
      animation: slideUp 0.3s ease-out;
    }

    .cookie-banner__content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 20px;

      p {
        flex: 1;
        font-size: 0.875rem;
        color: var(--color-text-light);
        line-height: 1.5;
      }

      a {
        color: var(--color-primary);
        text-decoration: underline;
      }
    }

    .cookie-banner__actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .cookie-banner__content {
        flex-direction: column;
        text-align: center;
      }
    }
  `],
})
export class CookieBannerComponent {
  consent = inject(CookieConsentService);
}
