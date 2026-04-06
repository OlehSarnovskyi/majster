import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastComponent } from './layout/toast/toast.component';
import { ConfirmComponent } from './layout/confirm/confirm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    ConfirmComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
