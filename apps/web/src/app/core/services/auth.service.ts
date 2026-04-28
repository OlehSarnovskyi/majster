import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, firstValueFrom, catchError, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleChosen: boolean;
  phone?: string;
  avatar?: string;
  bio?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private _userLoaded: Promise<void>;

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());
  isMaster = computed(() => this.currentUser()?.role === 'MASTER');

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this._userLoaded = this.loadUser();
  }

  /** Resolves when the initial user load completes (used by guards) */
  get whenReady(): Promise<void> {
    return this._userLoaded;
  }

  register(dto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.http
      .post<AuthResponse>('/api/auth/register', dto)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(dto: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>('/api/auth/login', dto)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  needsRoleSelection(): boolean {
    const user = this.currentUser();
    return !!user && !user.roleChosen;
  }

  loginWithGoogle() {
    window.location.href = '/api/auth/google';
  }

  handleGoogleCallback(token: string) {
    localStorage.setItem('accessToken', token);
    this._userLoaded = this.loadUser();
  }

  updateRole(role: string) {
    return this.http
      .patch<AuthResponse>('/api/auth/role', { role })
      .pipe(tap((res) => this.handleAuth(res)));
  }

  updateProfile(dto: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
  }) {
    return this.http
      .patch<User>('/api/auth/profile', dto)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http
      .post<User>('/api/auth/avatar', formData)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  deleteAccount() {
    return this.http.delete('/api/auth/account');
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>('/api/auth/forgot-password', { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post<{ message: string }>('/api/auth/reset-password', { token, password });
  }

  verifyEmail(token: string) {
    return this.http.get<{ message: string }>(`/api/auth/verify-email?token=${token}`);
  }

  resendVerification() {
    return this.http.post<{ message: string }>('/api/auth/resend-verification', {});
  }

  resendVerificationByEmail(email: string) {
    return this.http.post<{ message: string }>('/api/auth/resend-verification-email', { email });
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    this.currentUser.set(res.user);
  }

  private loadUser(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return Promise.resolve();
    }
    return firstValueFrom(
      this.http.get<User>('/api/auth/me').pipe(
        tap((user) => this.currentUser.set(user)),
        catchError(() => {
          localStorage.removeItem('accessToken');
          this.currentUser.set(null);
          return of(null);
        })
      )
    ).then(() => undefined);
  }
}
