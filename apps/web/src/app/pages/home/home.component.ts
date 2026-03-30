import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Category } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(true);

  constructor(private api: ApiService, private seo: SeoService) {}

  ngOnInit() {
    this.seo.setPage('', 'Find and book trusted craftsmen in Slovakia. Plumbing, electrical, painting, renovation and more.');
    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
