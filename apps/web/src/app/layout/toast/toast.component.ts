import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <span class="material-icons-outlined toast__icon">
            @switch (toast.type) {
              @case ('success') { check_circle }
              @case ('error') { error }
              @default { info }
            }
          </span>
          <span class="toast__msg">{{ toast.message }}</span>
          <span class="material-icons-outlined toast__close">close</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: calc(var(--header-height) + 12px);
      right: 16px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      background: white;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      animation: slideIn 0.25s ease-out;
      font-size: 0.875rem;
      color: var(--color-text);
      border-left: 4px solid;
    }

    .toast--success { border-left-color: var(--color-success); }
    .toast--error { border-left-color: var(--color-error); }
    .toast--info { border-left-color: var(--color-primary); }

    .toast__icon {
      font-size: 20px;
      flex-shrink: 0;
    }
    .toast--success .toast__icon { color: var(--color-success); }
    .toast--error .toast__icon { color: var(--color-error); }
    .toast--info .toast__icon { color: var(--color-primary); }

    .toast__msg { flex: 1; line-height: 1.4; }

    .toast__close {
      font-size: 18px;
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (max-width: 480px) {
      .toast-container {
        right: 8px;
        left: 8px;
        max-width: none;
      }
    }
  `],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
