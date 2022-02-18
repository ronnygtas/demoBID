import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../../services/login/login.service';
import { LoginModel, Permission } from 'src/app/classes/model/login-model';
import { RegisterMain } from './register-main.data';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.component.html',
  styleUrls: ['./register-main.component.scss'],
})
export class RegisterMainComponent implements OnInit {
  
  public data: RegisterMain;
  public logo: string = environment.logo_light;
  private token: string;

  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(
    private nav: NavController,
    private alert: AlertService,
    private storage: StorageService,
    private loginS: LoginService) {
    this.data = new RegisterMain();
  }

  async ngOnInit() {
    this.token =  await this.storage.get(environment.token);
  }

  public login(){
    this.loading.show();
    if(this.data.usuario && this.data.contrasena){
      this.loginS.userPassLogin(this.token, this.data.usuario, this.data.contrasena).subscribe( data => {
        let loginM: LoginModel = data.data;
        this.data.usuario = '';
        this.data.contrasena = '';
        if(data.code == environment.okCode){
          this.storage.save(environment.session, loginM);
          if(loginM.biometricEnrollment.fingerOk){
            this.alert.presentAlert('Error', 'Usuario ya enrolado', 'Ya tienes un enrolamiento activo, por lo cual no puedes volver a registrarte, inicia sesión en la pagina principal para comenzar', ['OK']);
            this.loading.hide();
          }else{
            let permission: boolean = false;
            loginM.profile.permissions.forEach((e)=>{
              permission = permission || e.id == environment.appPermission;
            });
            if(permission){
              this.alert.presentAlert('Inicio exitoso', loginM.name + ' ' + loginM.lastname + ' ' + loginM.middleName, 'Bienvenido!, inicia tu procedimiento de enrolamiento', ['OK']);
              this.loading.hide();
              this.continue();
            }else{
              this.alert.presentAlert('Error', 'Error de permisos', 'No posees los permisos necearios para acceder a la aplicación', ['OK']);
              this.loading.hide();
            }
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
      this.loading.hide();
      this.alert.presentAlert('Error', 'No has ingresado Usuario y Contraseña', 'Ingresa los parametros correctamente para continuar', ['OK']);
    }
  }

  public continue(){
    this.nav.navigateForward('registerId');
  }

  public back(){
    this.nav.pop();
  }
}
