import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  template: `
    @if (confirmService.visible()) {
      <div class="confirm-overlay" (click)="confirmService.cancel()" (keydown.escape)="confirmService.cancel()" tabindex="-1" role="dialog"></div>
      <div class="confirm-modal">
        <h3>{{ confirmService.options().title }}</h3>
        <p>{{ confirmService.options().message }}</p>
        <div class="confirm-modal__actions">
          <button class="btn btn--ghost" (click)="confirmService.cancel()">
            {{ confirmService.options().cancelText }}
          </button>
          <button
            class="btn"
            [class.btn--primary]="!confirmService.options().danger"
            [class.btn--danger-fill]="confirmService.options().danger"
            (click)="confirmService.accept()"
          >
            {{ confirmService.options().confirmText }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 2000;
      animation: fadeIn 0.15s ease-out;
    }

    .confirm-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2001;
      background: white;
      border-radius: var(--radius-lg);
      padding: 28px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      animation: scaleIn 0.2s ease-out;

      h3 {
        font-size: 1.125rem;
        margin-bottom: 8px;
      }

      p {
        font-size: 0.875rem;
        color: var(--color-text-light);
        line-height: 1.5;
        margin-bottom: 24px;
      }
    }

    .confirm-modal__actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    :host ::ng-deep .btn--danger-fill {
      background: var(--color-error);
      color: white;

      &:hover:not(:disabled) {
        background: #DC2626;
        color: white;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
      to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
  `],
})
export class ConfirmComponent {
  confirmService = inject(ConfirmService);
}
