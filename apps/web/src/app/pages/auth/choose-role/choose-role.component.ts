import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-choose-role',
  standalone: true,
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.scss',
})
export class ChooseRoleComponent {
  selectedRole = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  selectRole(role: string) {
    this.selectedRole.set(role);
  }

  confirm() {
    const role = this.selectedRole();
    if (!role) return;

    this.loading.set(true);
    this.auth.updateRole(role).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.loading.set(false),
    });
  }
}
