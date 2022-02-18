import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/classes/model/login-model';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Hands } from '../../../bid/components/enrollment/hands';
import { Fingers } from '../user-fingers/fingers';
import { BiometricosGeneralService } from '../../../services/serv-biometricos/biometricos-general.service';

@Component({
  selector: 'app-user-finger-sign',
  templateUrl: './user-finger-sign.component.html',
  styleUrls: ['./user-finger-sign.component.scss'],
})
export class UserFingerSignComponent implements OnInit {

  public dataFingers: Fingers;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  private token: string;
  private loginM: LoginModel;
  private operation: any;

  constructor(
    private nav: NavController,
    private alert: AlertService,
    private storage: StorageService,
    private serv_biometric: BiometricosGeneralService
  ) { 
    this.loading = new LoadingComponent();
    this.dataFingers = new Fingers();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.loginM = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.loading.hide();
  }

  public left(hand: Hands){
    this.loading.show();
    this.dataFingers.fingers = hand;
    this.storage.save(environment.left_valid, true);
    this.storage.save(environment.right_valid, false);
    console.log('LEFT-ENROLL');
    this.idemtifyEnrollment();
  }

  public right(hand: Hands){
    this.loading.show();
    this.dataFingers.fingers = hand;
    this.storage.save(environment.right_valid, true);
    this.storage.save(environment.left_valid, false);
    console.log('RIGHT-ENROLL');
    this.idemtifyEnrollment();
  }

  public both(hand: Hands){
    this.dataFingers.fingers = hand;
    this.storage.save(environment.right_valid, true);
    this.storage.save(environment.left_valid, true);
    console.log('BOTH-ENROLL');
    this.idemtifyEnrollment();
  }

  public idemtifyEnrollment() {
    this.loading.show();
    let numFingers: number = 0;
    numFingers += this.dataFingers.fingers.right_middle.active ? 1 : 0;
    numFingers += this.dataFingers.fingers.right_pinky.content ? 1 : 0;
    numFingers += this.dataFingers.fingers.right_ring.content ? 1 : 0;
    numFingers += this.dataFingers.fingers.right_index.content ? 1 : 0;
    numFingers += this.dataFingers.fingers.left_index.content ? 1 : 0;
    numFingers += this.dataFingers.fingers.left_middle.content ? 1 : 0;
    numFingers += this.dataFingers.fingers.left_pinky.content ? 1 : 0;
    numFingers += this.dataFingers.fingers.left_ring.content ? 1 : 0;
    if(numFingers >= 1) {
      this.loading.show();
      // Servicio para indenfycar al usuario y verificar si ya se esta enrrolado en la base y asi recuperar el id de la persona
      this.serv_biometric.veriSign(this.dataFingers.fingers, this.token, this.operation.operationId, this.loginM.user)
        .subscribe( result => {
          console.log('VERISIGN CLIENT  ', result);
          console.log('DataFingers', this.dataFingers);
          this.storage.save(environment.firmaBio, this.dataFingers.fingers.left_index.content);
          this.continue();
        }, error => {
          console.log('VERISIGN CLIENT ERROR  ', error);
          this.loading.hide();
          this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.idemtifyEnrollment() });
          
        });
    } else {
      this.alert.presentAlert('Error', 'Error en los datos de entrada', 'Debes ingresar al menos ambos indices para continuar', ['OK']);
    }
  }


  public back(){
    this.nav.pop();
  }

  public continue() {
    this.nav.navigateRoot('/userDocsRecord');
  }

}
