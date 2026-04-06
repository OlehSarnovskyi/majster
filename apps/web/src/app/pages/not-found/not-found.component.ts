import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container not-found">
      <span class="material-icons-outlined">explore_off</span>
      <h1>404</h1>
      <p>Stránka nebola nájdená</p>
      <a routerLink="/" class="btn btn--primary mt-3">Na úvod</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 120px 20px;

      .material-icons-outlined {
        font-size: 64px;
        color: var(--color-text-muted);
        margin-bottom: 16px;
      }

      h1 {
        font-size: 4rem;
        font-weight: 800;
        color: var(--color-text);
        margin-bottom: 8px;
      }

      p {
        font-size: 1.125rem;
        color: var(--color-text-light);
      }
    }
  `],
})
export class NotFoundComponent {}
