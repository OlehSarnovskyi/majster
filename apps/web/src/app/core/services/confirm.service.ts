import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  options = signal<ConfirmOptions>({
    title: '',
    message: '',
  });

  private resolve?: (value: boolean) => void;

  confirm(options: ConfirmOptions): Promise<boolean> {
    this.options.set({
      confirmText: 'Potvrdiť',
      cancelText: 'Zrušiť',
      ...options,
    });
    this.visible.set(true);

    return new Promise<boolean>((res) => {
      this.resolve = res;
    });
  }

  accept() {
    this.visible.set(false);
    this.resolve?.(true);
  }

  cancel() {
    this.visible.set(false);
    this.resolve?.(false);
  }
}
