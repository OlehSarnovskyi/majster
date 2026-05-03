import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Category } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

const HOME_CATEGORIES_LIMIT = 12;

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
  hasMore = signal(false);

  private api = inject(ApiService);
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.setPage('', 'Nájdite a rezervujte overených majstrov na Slovensku. Inštalatér, elektrikár, maliar, rekonštrukcia a ďalšie.');
    this.api.getCategories().subscribe({
      next: (cats) => {
        this.hasMore.set(cats.length > HOME_CATEGORIES_LIMIT);
        this.categories.set(cats.slice(0, HOME_CATEGORIES_LIMIT));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
