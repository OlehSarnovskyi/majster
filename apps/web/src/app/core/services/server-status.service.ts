import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServerStatusService {
  isDown = signal(false);

  markDown() {
    this.isDown.set(true);
  }

  markUp() {
    this.isDown.set(false);
  }
}
