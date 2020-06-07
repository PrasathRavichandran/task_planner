import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Injectable()

export class WebReqInterceptor implements HttpInterceptor {

  refreshingAccessToken: boolean;

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addAuthHeader(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log(error);

        if (error.status === 401 && !this.refreshingAccessToken) {
          // 401 error so we are unauthorized

          // refresh the access token
          return this.refreshAccessToken().pipe(
            // stop the earlier observable, then switch the current the observable
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              // console.log(err);
              this.authService.onLogout();
              return empty();
            })
          );

        }

        return throwError(error);
      })
    )
  }

  refreshAccessToken() {
    this.refreshingAccessToken = true;

    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        this.refreshingAccessToken = false;
        console.log('Access Token refreshed!');
      })
    )
  }

  addAuthHeader(request: HttpRequest<any>) {
    const token = this.authService.getAccessToken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }
}
