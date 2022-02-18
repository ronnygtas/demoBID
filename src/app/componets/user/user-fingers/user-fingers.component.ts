import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/classes/model/login-model';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Hands } from '../../../bid/components/enrollment/hands';
import { Fingers } from './fingers';
import { OperationService } from 'src/app/services/custome/operation.service';
import { BiometricosGeneralService } from '../../../services/serv-biometricos/biometricos-general.service';
import { OperationsObj } from '../../../classes/model/operations-obj';
import { UpdatePersonService } from 'src/app/services/updatePerson/update-person.service';
import { DataClient } from '../../../classes/model/data-client';
import { Person } from 'src/app/classes/model/person';

@Component({
  selector: 'app-user-fingers',
  templateUrl: './user-fingers.component.html',
  styleUrls: ['./user-fingers.component.scss'],
})

export class UserFingersComponent implements OnInit {

  public dataFingers: Fingers;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  
  private token: string;
  private agente: LoginModel;
  private operation: OperationsObj = new OperationsObj();
  private clientData: DataClient = new DataClient();
  private newClient: boolean;
  private person: Person = new Person();
  private loginM: LoginModel;
  private enroll: boolean;
  public name: string;
  public email: string;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private opId_serv: OperationService,
              private serv_biometric: BiometricosGeneralService,
              private serv_person: UpdatePersonService) {

    this.loading = new LoadingComponent();
    this.dataFingers = new Fingers();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.agente = await this.storage.get(environment.session);
    this.storage.save(environment.agente, this.agente);
    this.loginM = await this.storage.get(environment.session);
    // await this.generate_opID();
    this.enroll = true;
    this.loading.hide();
  }

  public exit(){
    this.nav.navigateRoot('home');
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
      this.serv_biometric.identifyEnrrol(this.dataFingers.fingers, this.token)
        .subscribe( result => {
          console.log('IDENTIFY CLIENT  ', result);
          if(result['code'] == -9999) {
            // Si encontrada
            this.clientData.personId = result['data']['person']['id'];
            this.clientData.operationId = result['data']['operationId'];
            this.operation.operationId = result['data']['operationId'];
            this.operation.systemCode = result['data']['person']['code'];
            this.name = result['data']['person']['firstName'] + ' ' + result['data']['person']['lastName'] + ' ' + result['data']['person']['middleName'];
            this.email = result['data']['person']['email'];
            this.enroll = false;
            this.storage.save(environment.enroll, this.enroll);
            this.storage.save(environment.operation, this.operation);
            this.loading.hide();
            this.finalizar();
          } else {
            // No encontrada
            this.clientData.newClient = true;
            this.newClient = true;
            this.storage.save(environment.hand, this.dataFingers.fingers);
            this.generate_opID();
          }
        }, error => {
          console.log('IDENTIFY CLIENT ERROR  ', error);
          this.loading.hide();
          this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.idemtifyEnrollment() });
          
        });
    } else {
      this.alert.presentAlert('Error', 'Error en los datos de entrada', 'Debes ingresar al menos ambos indices para continuar', ['OK']);
    }
  }

  private createPerson() {
    // Si no se encontro en el servicio de identifyEnrrol se crea a una persona para crear el nuevo registro sobre ella
    this.serv_person.createPersonaOperation(this.token, this.agente.user, this.operation.operationId)
                .subscribe( result => {
                    console.log('CREATE PERSON  ', result);
                    if(result['code'] == -9999) {
                      this.clientData.personId = result['data']['person']['id']
                      this.person = result['data']['person'];
                      this.storage.save(environment.person, this.person);
                      this.storage.save(environment.dataClient, this.clientData);
                      this.loading.hide();
                      console.log('CREATE PERSON  INSIDE', result);
                      this.continue();
                    } else {
                      this.loading.hide();
                      this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Se presento un problema al querer crear su registro, por favor para poder avanzar de clic en Reitentar', 'Reitentar', ()=> { this.createPerson() });
                    }

                  }, error => {
                    console.log('CREATE PERSON ERROR  ', error);
                    this.loading.hide();
                    this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.createPerson() });
                    
                  });
    
  }

  private async generate_opID() {
    // Se genera una operacion respecto a la persona ya sea que se alla encontrado o se alla generado una nueva persona
    // Al servicio se manda persona para generar una operacion respecto a ella
    this.opId_serv.generateOpIdNoPerson(this.token, this.loginM.user)
                .subscribe( result => {
                  console.log('CREATE OP_ID', result);
                  if(result['code'] == -9999) {
                    this.operation = result['data'];
                    this.storage.save(environment.operation, this.operation);
                    this.createPerson();
                  } else {
                    this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Se presento un problema al querer crear su registro, por favor para poder avanzar de clic en Reitentar', 'Reitentar', ()=>{ this.generate_opID() });
                  }
                }, error => {
                  console.log('CREATE OP_ID ERROR ', error);
                  this.loading.hide();
                  this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.generate_opID() });

                });
  }

  public back(){
    this.nav.pop();
  }

  public continue() {
    console.log('Entro al continue');
    this.nav.navigateForward('/userFingersVerify');
  }

  private finalizar(){
    this.alert.presentAlert('Usuario encontrado', this.name + '\n' + this.email , 'El usuario fue encontrado, por lo tanto, no necesita de enrolarse nuevamente', ['OK']);
    this.nav.navigateRoot('/userMain');
  }

}
