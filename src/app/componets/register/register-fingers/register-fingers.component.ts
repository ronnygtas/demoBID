import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/classes/model/login-model';
import { AlertService } from 'src/app/bid/services/alert.service';
import { StorageService } from 'src/app/bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Hands } from 'src/app/bid/components/enrollment/hands';
import { Fingers } from './fingers';
import { BiometricosGeneralService } from '../../../services/serv-biometricos/biometricos-general.service';
import { OperationsObj } from '../../../classes/model/operations-obj';

@Component({
  selector: 'app-register-fingers',
  templateUrl: './register-fingers.component.html',
  styleUrls: ['./register-fingers.component.scss'],
})
export class RegisterFingersComponent implements OnInit {

  public data: Fingers;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private biometric_serv: BiometricosGeneralService) {

    this.data = new Fingers();
    this.loading = new LoadingComponent();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.loading.hide();
  }

  public left(hand: Hands){
    this.data.data = hand;
    this.data.enrollLeft = true;
    this.data.leftData = true;
  }

  public right(hand: Hands){
    this.data.data = hand;
    this.data.enrollRight = true;
    this.data.rightData = true;
  }

  public both(hand: Hands){
    this.data.data = hand;
    this.data.enrollRight = true;
    this.data.enrollLeft = true;
    this.data.rightData = true;
    this.data.leftData = true;
  }

  public async enroll(){
    if(this.data.data.left_index.content && this.data.data.right_index.content) {
      this.loading.show();
      // [servicio] implementación de servicio de enrolamiento
      this.biometric_serv.enrollBiometric(this.data.data, this.token, this.operation.operationId, this.operation.systemCode, this.login.person, this.login.user, 1)
                      .subscribe( data => {
                        console.log('Enrroll Fingers  ', data);
                        this.loading.hide();
                        
                        if(data['code'] === -9999) {
                          this.data.enrollLeft = true;
                          this.data.enrollRight = true;
                          this.continue();
                        } else {
                          this.alert.presentAlert('¡Ocurrio un problema!', 'Por favor vuelva a capturar sus huellas para intentar guardarlas nuevamente', '', ['Entiendo']);
                          this.data.data = new Hands();
                          this.data.enrollLeft = false;
                          this.data.enrollRight = false;
                          if(environment.debug){this.continue();}
                        }
                        
                      }, error => {
                        console.log('Enrroll Fingers Error  ', error);
                        this.loading.hide();
                        this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.enroll()  });
                      });
    } else {
      this.alert.presentAlert('Error', 'Ingresa ambas huellas para poder avanzar', 'Intente enrolar de nuevo para continuar', ['OK']);
    }
  }

  public back(){
    this.nav.pop();
  }

  public continue(): void{
    if(this.data.enrollLeft && this.data.enrollRight) {
      this.storage.save(environment.fingers_storage, this.data.data);
      this.nav.navigateForward('/registerOCR');
    }else{
      this.alert.presentAlert('Error', 'No se han capturado las huellas', 'Intente capturar sus huellas nuevamente', ['OK']);
    }
  }

}
