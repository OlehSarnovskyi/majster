import { Component, OnInit, signal, input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, Service } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
})
export class BookingComponent implements OnInit {
  id = input.required<string>();
  service = signal<Service | null>(null);
  loading = signal(true);
  submitting = signal(false);
  error = signal('');

  date = '';
  time = '';
  note = '';

  private api = inject(ApiService);
  auth = inject(AuthService);
  private router = inject(Router);
  private seo = inject(SeoService);

  ngOnInit() {
    this.api.getService(this.id()).subscribe({
      next: (svc) => {
        this.service.set(svc);
        this.loading.set(false);
        this.seo.setPage(`Rezervovať ${svc.name}`);
      },
      error: () => this.loading.set(false),
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.date = tomorrow.toISOString().split('T')[0];
    this.time = '10:00';
  }

  get minDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  submit() {
    if (!this.date || !this.time) {
      this.error.set('Please select date and time');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    const startTime = new Date(`${this.date}T${this.time}:00`).toISOString();

    this.api
      .createBooking({
        serviceId: this.id(),
        startTime,
        note: this.note || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to create booking');
          this.submitting.set(false);
        },
      });
  }
}
