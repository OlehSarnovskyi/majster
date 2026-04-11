import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only attach token to our own API requests
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const token = localStorage.getItem('accessToken');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
