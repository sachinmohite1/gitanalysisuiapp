// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
  
    return authService.currentUser.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          router.navigate(['/home']);
          return false;
        }
      })
    );
  };