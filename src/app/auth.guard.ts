import { CanActivateFn, Router } from '@angular/router';
import { LoginAuthService } from './services/login-auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const loginAuthService = inject(LoginAuthService);
  const router = inject(Router);

  return loginAuthService.usuarioLogueado() ? true : router.parseUrl('/login');
};
