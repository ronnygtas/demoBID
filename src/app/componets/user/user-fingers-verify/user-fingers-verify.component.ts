import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { UserFingersVerify } from './user-fingers-verify';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Person } from 'src/app/classes/model/person';
import { UpdatePersonService } from 'src/app/services/updatePerson/update-person.service';
import { LoginModel } from 'src/app/classes/model/login-model';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-user-fingers-verify',
  templateUrl: './user-fingers-verify.component.html',
  styleUrls: ['./user-fingers-verify.component.scss'],
})
export class UserFingersVerifyComponent implements OnInit {

  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  private token: string;
  private login: LoginModel;
  private agente: any;
  private operation: any;
  private cliente: any;
  private person: Person;
  public data: UserFingersVerify;
  public enroll: boolean;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(private nav: NavController,
    private alert: AlertService,
    private storage: StorageService,
    private keyboard: Keyboard,
    private serv_person: UpdatePersonService) {
    this.data = new UserFingersVerify();
    this.loading = new LoadingComponent();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.cliente = await this.storage.get(environment.client);
    this.person = await this.storage.get(environment.person);
    this.enroll = await this.storage.get(environment.enroll);
    this.data.email = this.person.email.length < 10 ? '': this.person.email ;
    this.data.numero = null;
    // si el cliente es nuevo
    this.data.newClient = await this.storage.get(environment.newClient);
    this.loading.hide();
  }

  public back(){
    this.nav.navigateForward('/userMain');
  }

  public continuar(): void{
    if(!this.data.validAllParams()){
      this.alert.presentAlert('Error', 'Error en las entradas', 'Verifique que las entradas sean validas antes de enviar el fomulario', ['OK']);
    }else{
      this.loading.show();
      this.updatePerson();
      this.storage.save(environment.telefono, this.data.numero);
      this.storage.save(environment.email, this.data.email);
      this.loading.hide();
      this.nextPage();
    }
  }

  private updatePerson() {
    // Si no se encontro en el servicio de identifyEnrrol se crea a una persona para crear el nuevo registro sobre ella
    this.person.email = this.data.email;
    this.serv_person.updatePersonaOperation(this.token, this.login.user, this.operation.operationId, this.person)
    .subscribe( result => {
        console.log('UPDATE PERSON ', result);
        if(result['code'] == -9999) {
          this.person = result['data']['person'];
          this.storage.save(environment.person, this.person);
          this.serv_person.savePersonPhone(this.token, this.login.user, this.operation.operationId, this.person.id, this.data.numero)
          .subscribe( result => {
            console.log('UPDATE PERSON PHONE ', result);
            if(result['code'] == -9999) {
              this.loading.hide();
              this.continue();
            }else{
              this.loading.hide();
              this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Se presento un problema al querer crear su registro, por favor para poder avanzar de clic en Reitentar', 'Reitentar', ()=> { this.updatePerson() });
            }
          }, error => {
            console.log('CREATE PERSON ERROR  ', error);
            this.loading.hide();
            this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.updatePerson() });
          });
        } else {
          this.loading.hide();
          this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Se presento un problema al querer crear su registro, por favor para poder avanzar de clic en Reitentar', 'Reitentar', ()=> { this.updatePerson() });
        }  
      }, error => {
        console.log('CREATE PERSON ERROR  ', error);
        this.loading.hide();
        this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.updatePerson() });
    });
  }

  public continue(){
    this.nextPage();
  }

  private nextPage(){
    this.nav.navigateForward('/userId');
  }

  public hideKey(){
    this.keyboard.hide();
  }

}
