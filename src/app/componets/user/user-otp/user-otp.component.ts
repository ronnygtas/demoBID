import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { OtpService } from '../../../services/otp/otp.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { LoginModel } from 'src/app/classes/model/login-model';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-user-otp',
  templateUrl: './user-otp.component.html',
  styleUrls: ['./user-otp.component.scss'],
})
export class UserOtpComponent implements OnInit {

  public celular: number;
  public codigoOtp: any;
  private login: LoginModel;
  private codigoResultOtp: any;
  private email: string;
  private token: any;
  private operation: any;
  public logout: string = environment.logo_blanco;

  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(
    private nav: NavController,
    private alert: AlertService,
    private otpService: OtpService,
    private device: Device,
    private storage: StorageService
  ) {
    this.loading = new LoadingComponent();
   }

  async ngOnInit() {

    this.token = await this.storage.get(environment.token);
    this.operation = await this.storage.get(environment.operation);
    this.login = await this.storage.get(environment.session);
    this.celular = await this.storage.get(environment.telefono);
    this.email = await this.storage.get(environment.email);
    this.envia_otp();

  }

  public envia_otp(){

    this.loading.show();
    this.otpService.sendOtp(this.celular, this.email, this.token, this.operation.operationId, this.login.user)
        .subscribe(result =>{
            this.loading.hide();
            console.log('OTP Result', result);
        }, error => {
            this.loading.hide();
            this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reintentar', ()=> { this.envia_otp()  });
            console.log('OTP Error', error);
        });

  }

  public back(){
    this.nav.pop();
  }

  public continuar(): void{
    this.loading.show();
    if (this.codigoOtp === '' || this.codigoOtp === null || this.codigoOtp === undefined){
      this.loading.hide();
      this.alert.presentAlert('¡Ocurrio un problema!', 'El codigo no puede ir en blanco', '', ['Entiendo']);
    } else {
      this.otpService.validateOtp(this.codigoOtp, this.token, this.operation.operationId, this.login.user)
          .subscribe(result => {
              console.log('Validate Result', result);
              if (result['code'] === -9999){
                this.loading.hide();
                this.nav.navigateForward('/userSign');
              } else {
                if (result['code'] === -9805){
                  this.loading.hide();
                  this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'El codigo ha expirado', '', 'Reenviar codigo', ()=> { this.envia_otp()  });
                } else {
                  if (result['code'] === -9724){
                    this.loading.hide();
                    this.alert.presentAlert('¡Ocurrio un problema!', 'El codigo es incorrecto, favor de verificarlo o dar clic en el boton de enviar de nuevo', '', ['Entiendo']);
                  }
                }
              }
          }, error => {
            this.loading.hide();
            console.log('Validate Error', error);
            this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reintentar', ()=> { this.continuar()  });
          });
    }

  }

}
