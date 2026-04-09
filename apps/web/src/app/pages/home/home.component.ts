import { Component, OnInit, signal, inject } from '@angular/core';
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

  private api = inject(ApiService);
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.setPage('', 'Nájdite a rezervujte overených majstrov na Slovensku. Inštalatér, elektrikár, maliar, rekonštrukcia a ďalšie.');
    this.api.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
