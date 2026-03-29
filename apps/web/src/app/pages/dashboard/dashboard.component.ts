import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  ApiService,
  Booking,
  Category,
  Service,
} from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  activeTab = signal<'bookings' | 'services'>('bookings');

  // Master: manage services
  myServices = signal<Service[]>([]);
  loadingServices = signal(false);
  categories = signal<Category[]>([]);
  showServiceForm = signal(false);
  editingService = signal<string | null>(null);
  savingService = signal(false);
  svcName = '';
  svcDesc = '';
  svcPrice = 0;
  svcDuration = 60;
  svcCategoryId = '';

  pendingBookings = computed(() =>
    this.bookings().filter((b) => b.status === 'PENDING')
  );
  otherBookings = computed(() =>
    this.bookings().filter((b) => b.status !== 'PENDING')
  );

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadBookings();
    if (this.auth.isMaster()) {
      this.api.getCategories().subscribe((cats) => this.categories.set(cats));
      this.loadServices();
    }
  }

  loadBookings() {
    this.loading.set(true);
    this.api.getMyBookings().subscribe({
      next: (b) => {
        this.bookings.set(b);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadServices() {
    this.loadingServices.set(true);
    const masterId = this.auth.user()?.id;
    if (!masterId) return;
    this.api.getServices({ masterId }).subscribe({
      next: (s) => {
        this.myServices.set(s);
        this.loadingServices.set(false);
      },
      error: () => this.loadingServices.set(false),
    });
  }

  updateStatus(id: string, status: string) {
    this.api
      .updateBookingStatus(id, status)
      .subscribe(() => this.loadBookings());
  }

  statusClass(status: string): string {
    return `badge badge--${status.toLowerCase()}`;
  }

  // Service CRUD
  openNewService() {
    this.editingService.set(null);
    this.svcName = '';
    this.svcDesc = '';
    this.svcPrice = 0;
    this.svcDuration = 60;
    this.svcCategoryId = this.categories()[0]?.id || '';
    this.showServiceForm.set(true);
  }

  editService(svc: Service) {
    this.editingService.set(svc.id);
    this.svcName = svc.name;
    this.svcDesc = svc.description;
    this.svcPrice = Number(svc.price);
    this.svcDuration = svc.durationMinutes;
    this.svcCategoryId = svc.categoryId;
    this.showServiceForm.set(true);
  }

  saveService() {
    this.savingService.set(true);
    const dto = {
      name: this.svcName,
      description: this.svcDesc,
      price: this.svcPrice,
      durationMinutes: this.svcDuration,
      categoryId: this.svcCategoryId,
    };

    const obs = this.editingService()
      ? this.api.updateService(this.editingService()!, dto)
      : this.api.createService(dto);

    obs.subscribe({
      next: () => {
        this.showServiceForm.set(false);
        this.savingService.set(false);
        this.loadServices();
      },
      error: () => this.savingService.set(false),
    });
  }

  deleteService(id: string) {
    if (confirm('Delete this service?')) {
      this.api.deleteService(id).subscribe(() => this.loadServices());
    }
  }
}
