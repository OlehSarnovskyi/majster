import { Component, OnInit, signal, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, Category, Service } from '../../core/services/api.service';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.scss',
})
export class CategoryDetailComponent implements OnInit {
  slug = input.required<string>();
  category = signal<(Category & { services: Service[] }) | null>(null);
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCategoryBySlug(this.slug()).subscribe({
      next: (cat) => {
        this.category.set(cat);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
