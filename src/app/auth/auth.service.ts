import { Injectable } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { shareReplay, tap } from 'rxjs/operators';

import { WebrequestService } from '../services/webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webRequestService: WebrequestService, private router: Router, private http: HttpClient) { }

  onLogin(email: string, password: string) {
    return this.webRequestService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    )
  }

  onSignup(email: string, password: string) {
    return this.webRequestService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    )
  }

  onLogout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user_id');
  }

  setAccessToken(token: string) {
    localStorage.setItem('x-access-token', token);
  }

  private setSession(user_id, access_token, refresh_token) {
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('x-access-token', access_token);
    localStorage.setItem('x-refresh-token', refresh_token);
  }

  private removeSession() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.get(`${this.webRequestService.URL}/user/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }

}
