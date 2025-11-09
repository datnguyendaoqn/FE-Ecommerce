import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserRole, selectIsRestored } from '@features/auth/store/auth.selectors';
import { map, filter, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const sellerGuard: CanActivateFn = (): Observable<boolean> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsRestored).pipe(
    
    filter(isRestored => isRestored === true),
    
    switchMap(() => {
      return store.select(selectUserRole).pipe(
        map(role => {
          if (role === 'seller') {
            return true; 
          }

          router.navigate(['/']);
          return false;
        })
      );
    })
  );
};