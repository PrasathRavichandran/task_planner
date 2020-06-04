import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebrequestService {
  readonly URL = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  GET(uri: string) {
    return this.http.get(`${this.URL}/${uri}`);
  }

  POST(uri: string, payload: Object) {
    return this.http.post(`${this.URL}/${uri}`, payload);
  }

  PATCH(uri: string, payload: Object) {
    return this.http.patch(`${this.URL}/${uri}`, payload, { responseType: 'text' });
  }

  DELETE(uri: string) {
    return this.http.delete(`${this.URL}/${uri}`);
  }

}
