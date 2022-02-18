import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { Enroll } from './enroll';
import { LoginModel } from 'src/app/classes/model/login-model';
import { OperationsObj } from 'src/app/classes/model/operations-obj';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Hands } from '../../../bid/components/enrollment/hands';
import { BiometricosGeneralService } from 'src/app/services/serv-biometricos/biometricos-general.service';
import { DataClient } from 'src/app/classes/model/data-client';
import { Person } from 'src/app/classes/model/person';
import { EnrollmentComponent } from '../../../bid/components/enrollment/enrollment.component';

@Component({
  selector: 'app-user-enroll',
  templateUrl: './user-enroll.component.html',
  styleUrls: ['./user-enroll.component.scss'],
})
export class UserEnrollComponent implements OnInit {

  public data: Enroll;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;
  
  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  private person: Person;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  @ViewChild(EnrollmentComponent, {static: true}) enrollment: EnrollmentComponent;
  private clientData: DataClient = new DataClient();
  private left_valid: boolean = false;
  private right_valid: boolean = false;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private biometric_serv: BiometricosGeneralService) {
                
    this.loading = new LoadingComponent();
    this.data = new Enroll();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.person = await this.storage.get(environment.person);
    this.data.data = await this.storage.get(environment.hand);
    this.enrollment.initFingers(this.data.data);
    this.right_valid = await this.storage.get(environment.right_valid);
    this.data.enrollRight = this.right_valid;
    this.left_valid = await this.storage.get(environment.left_valid);
    this.data.enrollLeft = this.left_valid;
    if(this.left_valid){this.enrollment.toggleLeft();}
    if(this.right_valid){this.enrollment.toggleRight();}
    console.log('First fingers', JSON.stringify(this.enrollment.control));
    this.loading.hide();
  }

  public left(hand: Hands){
    this.loading.show();
    this.data.data = hand;
    this.data.enrollLeft = true;
    this.data.leftData = true;
    this.continue();
  }

  public right(hand: Hands) {
    this.loading.show();
    this.data.data = hand;
    this.data.enrollRight = true;
    this.data.rightData = true;
    this.continue();
  }
  
  public both(hand: Hands){
    this.loading.show();
    this.data.data = hand;
    this.data.enrollRight = true;
    this.data.enrollLeft = true;
    this.data.rightData = true;
    this.data.leftData = true;
    this.continue();
  }

  public enroll() {
    this.loading.show();
    this.storage.save(environment.hand, this.data.data);
    console.log('Finger antes de Enroll', this.data.data);
    // Servicio de enrolamiento de huellas del cliente
    this.biometric_serv.enrollBiometric(this.data.data, this.token, this.operation.operationId, this.operation.systemCode, this.person.id, '', 2)
    .subscribe( result => {
      console.log('ENROLL CLIENT  ', result);
      this.loading.hide();

      if(result['code'] === -9999) {
        this.storage.save(environment.hand, this.data.data);
        this.continue();
      } else {
        this.alert.presentAlert('¡Ocurrio un problema!', 'Por favor vuelva a capturar sus huellas para intentar guardarlas nuevamente', '', ['Entiendo']);
      }
    }, error => {
      console.log('ENROLL CLIENT ERROR  ', error);
      this.loading.hide();
      this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.enroll()  });
    });
  }

  public back(){
    this.nav.pop();
  }

  public continue(): void{
    this.loading.hide();
    if(this.data.enrollLeft && this.data.enrollRight) {
      this.storage.save(environment.fingers_storage, this.data.data);
      this.storage.save(environment.hand, this.data.data);
      console.log('Final fingers', JSON.stringify(this.enrollment.control));
      console.log('Final hand fingers', JSON.stringify(this.data.data));
      this.nav.navigateForward('/userFacial');
    }else{
      this.alert.presentAlert('Error', 'No se han capturado las huellas', 'Intente capturar sus huellas nuevamente', ['OK']);
    }
  }

}
