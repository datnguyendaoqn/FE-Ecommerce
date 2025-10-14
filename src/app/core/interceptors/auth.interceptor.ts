import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';
import { logout } from '@features/auth/store/auth.actions';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const store = inject(Store);
    const logger = inject(NGXLogger);
    const router = inject(Router);

    // Skip token cho public URLs
    const publicUrls = ['/auth/login', '/auth/register'];
    if (publicUrls.some(url => req.url.includes(url))) {
        logger.debug('Public request:', req.url);
        return next(req);
    }

    //  Lấy token trực tiếp từ localStorage (synchronous)
    const token = localStorage.getItem('token');

    if (!token) {
        logger.warn('No token found for:', req.url);
        return next(req);
    }

    //  Clone request và thêm token
    const clonedReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    logger.debug('Request with token:', {
        url: req.url,
        method: req.method
    });

    //  Gửi request và handle errors
    return next(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                logger.error('Unauthorized - logging out');
                localStorage.removeItem('token'); //  Xóa token
                store.dispatch(logout());
                router.navigate(['/login']);
            }

            logger.error('HTTP Error:', {
                status: error.status,
                url: req.url,
                message: error.message
            });

            return throwError(() => error);
        })
    );
};