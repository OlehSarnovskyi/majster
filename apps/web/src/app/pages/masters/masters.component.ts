import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Master } from '../../core/services/api.service';

@Component({
  selector: 'app-masters',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './masters.component.html',
  styleUrl: './masters.component.scss',
})
export class MastersComponent implements OnInit {
  masters = signal<Master[]>([]);
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMasters().subscribe({
      next: (m) => {
        this.masters.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getInitials(m: Master): string {
    return (m.firstName[0] + m.lastName[0]).toUpperCase();
  }
}
