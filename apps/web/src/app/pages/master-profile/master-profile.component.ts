import { Component, OnInit, signal, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Master } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

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

  private api = inject(ApiService);
  private seo = inject(SeoService);

  ngOnInit() {
    this.api.getMaster(this.id()).subscribe({
      next: (m) => {
        this.master.set(m);
        this.loading.set(false);
        this.seo.setPage(
          `${m.firstName} ${m.lastName}`,
          `${m.firstName} ${m.lastName} — profesionálny majster na Majster.sk. ${m.services?.length || 0} dostupných služieb.`
        );
      },
      error: () => this.loading.set(false),
    });
  }

  getInitials(m: Master): string {
    return (m.firstName[0] + m.lastName[0]).toUpperCase();
  }
}
