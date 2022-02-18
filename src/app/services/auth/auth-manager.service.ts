import { Injectable } from '@angular/core';
import { ServicesExService } from '../../bid/services/services-ex.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../bid/services/storage.service';
import { Auth } from '../../classes/model/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  constructor(
    private serv: ServicesExService,
    private storage: StorageService) { }

  public auth(): Observable<any>{
    let headers = new HttpHeaders({
      'authorization': 'Basic ' + environment.encoded,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
 
    const params = new HttpParams()
    .set('grant_type', 'password')
    .set('username', environment.user)
    .set('password', environment.password);


    return this.serv.post(environment.servicesURL + environment.authService, params, {headers});
  }

  public authHandler( response: any): Promise<any>{
    let auth: Auth = new Auth();
    auth.access_token = response.access_token;
    auth.token_type = response.token_type;
    auth.refresh_token = response.refresh_token;
    auth.expires_in = response.expires_in;
    auth.scope = response.scope;
    auth.jti = response.jti;
    return this.storage.save(environment.token, auth);
  }
}
