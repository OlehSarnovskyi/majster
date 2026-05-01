import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-choose-role',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.scss',
})
export class ChooseRoleComponent {
  selectedRole = signal<string | null>(null);
  phone = '';
  phoneError = '';
  loading = signal(false);

  private auth = inject(AuthService);
  private router = inject(Router);

  selectRole(role: string) {
    this.selectedRole.set(role);
    this.phoneError = '';
  }

  confirm() {
    const role = this.selectedRole();
    if (!role) return;

    if (role === 'MASTER') {
      if (!this.phone.trim()) {
        this.phoneError = 'Telefónne číslo je povinné pre majstrov';
        return;
      }
      if (this.phone.trim().length < 9) {
        this.phoneError = 'Zadajte platné telefónne číslo';
        return;
      }
    }

    this.phoneError = '';
    this.loading.set(true);
    this.auth.updateRole(role, role === 'MASTER' ? this.phone.trim() : undefined).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.loading.set(false),
    });
  }
}
