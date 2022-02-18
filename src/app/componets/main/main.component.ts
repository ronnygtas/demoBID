import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { MainData } from './main.data';
import { LoadingComponent } from '../../bid/components/loading/loading.component';
import { EnrollmentComponent } from '../../bid/components/enrollment/enrollment.component';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { TokenService } from '../../services/auth/token.service';
import { StorageService } from '../../bid/services/storage.service';
import { AlertService } from '../../bid/services/alert.service';
import { GeopositionService } from '../../bid/services/geoposition.service';
import { Hands } from 'src/app/bid/components/enrollment/hands';
import { LoginService } from 'src/app/services/login/login.service';
import { LoginModel } from 'src/app/classes/model/login-model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  public image: string = environment.logo;
  public data: MainData;
  private token: string;
  private loginM: LoginModel;
  
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(private nav: NavController,
    private tokenS: TokenService,
    private storage: StorageService,
    private alert: AlertService,
    private http: HttpClient,
    private geo: GeopositionService,
    private login_serv: LoginService){
    this.data = new MainData();
  }

  async ngOnInit(){
    await this.getToken();
    this.geo.getPosition();
  }

  private async getToken(){
    this.loading.show();
    const headers = new HttpHeaders({
      'authorization': 'Basic dXNlcmFwcDpwYXNzd29yZA==',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const params = new HttpParams()
    .set('grant_type', 'password')
    .set('username', environment.user)
    .set('password', environment.password);

    await this.http.post(environment.servicesURL + environment.authService, params, {headers})
    .subscribe( async data => {
      this.token = data['access_token'];
      console.log('Token', this.token);
      this.storage.save(environment.token, this.token);
      this.loading.hide();
    }, async error => {
      this.loading.hide();
      this.alert.presentAlertSimpleConfirm('Error', 'Error al conectarse al servidor', '', 'Intentar de nuevo', () => {
        this.getToken();
      });
    });
  }

  public register(){
    this.nav.navigateForward('registerMain');
  }

  public login(){
    if(this.data.fingers.left_index.content && this.data.usuario) {
      this.loading.show();
      // [servicio] llamado a servicio de login por usuario y huellas
      this.login_serv.userFingerLogin(this.token, this.data.usuario, this.data.fingers.left_index.content).subscribe( result => {
        
        console.log('LOGIN FINGERS  ', result);
        this.loading.hide();
        let loginM: LoginModel = new LoginModel(); // objeto de sesion de agente
        if(result['code'] == -9999) {
          loginM = result['data'];
          if(loginM.biometricEnrollment.fingerOk){
            let permission: boolean = false;
            loginM.profile.permissions.forEach((e)=>{
              permission = permission || e.id == environment.appPermission;
            });
            if(permission){
              this.alert.presentAlert('Inicio exitoso', 'Bienvenido!', loginM.name + ' ' + loginM.lastname + ' ' + loginM.middleName, ['OK']);
              this.storage.save(environment.session, this.loginM);
              this.data.usuario = '';
              this.data.contrasena = '';
              this.data.fingers = new Hands();
              this.loading.hide();
              this.continue();
            }else{
              this.alert.presentAlert('Error', 'Error de permisos', 'No posees los permisos necearios para acceder a la aplicación', ['OK']);
              this.loading.hide();
            }
          }else{
            this.alert.presentAlert('Error', 'Usuario sin enrolar', 'Aun no tienes un enrolamiento activo, registrate para poder utilizar la aplicación', ['OK']);
            this.loading.hide();
          }
        } else {
          this.alert.presentAlert('No puede ingresar', 'No se encontro ningun usuario con los datos ingresados, vuelva a capturar sus huellas o verifique su usuario por favor', '', ['OK']);
          
        }
        
      }, error => {
        console.log('LOGIN FINGERS ERROR  ', error);
        this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Se esta presentando un problema con la conexion', '', 'Reitentar', ()=> { this.login() });
      });
    }else if(this.data.usuario && this.data.contrasena){
      this.login_serv.userPassLogin(this.token, this.data.usuario, this.data.contrasena).subscribe( data => {
        let loginM: LoginModel = data.data;
        this.data.usuario = '';
        this.data.contrasena = '';
        if(data.code == environment.okCode){
          this.storage.save(environment.session, loginM);
          if(loginM.biometricEnrollment.fingerOk){
            let permission: boolean = false;
            loginM.profile.permissions.forEach((e)=>{
              permission = permission || e.id == environment.appPermission;
            });
            if(permission){
              this.alert.presentAlert('Inicio exitoso', 'Bienvenido!', loginM.name + ' ' + loginM.lastname + ' ' + loginM.middleName, ['OK']);
              this.loginM = data.data;
              this.storage.save(environment.session, this.loginM);
              this.data.usuario = '';
              this.data.contrasena = '';
              this.data.fingers = new Hands();
              this.loading.hide();
              this.continue();
            }else{
              this.alert.presentAlert('Error', 'Error de permisos', 'No posees los permisos necearios para acceder a la aplicación', ['OK']);
              this.loading.hide();
            }
          }else{
            this.alert.presentAlert('Error', 'Usuario sin enrolar', 'Aun no tienes un enrolamiento activo, registrate para poder utilizar la aplicación', ['OK']);
            this.loading.hide();
          }
        }else{
          this.loading.hide();
          this.alert.presentAlert('Error', 'Inicio de sesión incorrecto', 'Verifica tus datos de inicio de sesión e intentalo de nuevo', ['OK']);
        }
      }, error => {
        console.log(JSON.stringify(error));
        this.alert.presentAlert('Error ' + error.status, 'Error de inicio de sesión', 'Ocurrió un error al ejecutar la petición, intentalo de nuevo', ['OK']);
        this.loading.hide();
      });
    }else{
      this.alert.presentAlert('Error', 'Error en los parametros', 'Asegurate de haber introducido los parametros necesarios', ['OK']);
    }
  }

  public left(hands: Hands){
    this.data.fingers = hands;
  }

  private continue(){
    this.nav.navigateRoot('userMain');
  }

}
