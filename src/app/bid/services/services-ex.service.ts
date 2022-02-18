import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesExService {

  constructor(private http: HttpClient) {}

  public post( url: string, body: any, options: any): Observable<any>{
    return this.http.post(url, body, options);
  }

  public get( url: string, options: any): Observable<any>{
    return this.http.get(url, options);
  }

  public put( url: string, body: any, options: any): Observable<any>{
    return this.http.put( url, body, options);
  }
}
