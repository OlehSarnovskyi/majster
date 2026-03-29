import { Component, OnInit, signal, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Master } from '../../core/services/api.service';

@Component({
  selector: 'app-master-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './master-profile.component.html',
  styleUrl: './master-profile.component.scss',
})
export class MasterProfileComponent implements OnInit {
  id = input.required<string>();
  master = signal<Master | null>(null);
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMaster(this.id()).subscribe({
      next: (m) => {
        this.master.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getInitials(m: Master): string {
    return (m.firstName[0] + m.lastName[0]).toUpperCase();
  }
}
