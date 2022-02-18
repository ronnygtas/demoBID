import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Ine } from './ine';
import { LoadingComponent } from 'src/app/bid/components/loading/loading.component';
import { LoginModel } from 'src/app/classes/model/login-model';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { environment } from 'src/environments/environment';
import { OperationsObj } from 'src/app/classes/model/operations-obj';
import { ConsultaIneService } from '../../../services/consultaIne/consulta-ine.service';
import { Ocr } from '../../../classes/model/ocr';
import { Hands } from 'src/app/bid/components/enrollment/hands';
import { BiometricosGeneralService } from 'src/app/services/serv-biometricos/biometricos-general.service';

@Component({
  selector: 'app-register-ine',
  templateUrl: './register-ine.component.html',
  styleUrls: ['./register-ine.component.scss'],
})
export class RegisterIneComponent implements OnInit {

  public data: Ine = new Ine();
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  public dataPerson: Ocr;
  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  private person: any;
  private hands: Hands;
  private mapaFingers: any;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  private falloIne: boolean;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private serv_ine: ConsultaIneService,
              private biometric_serv: BiometricosGeneralService) {
                
    this.loading = new LoadingComponent();
    this.mapaFingers = new Map();
  }

  async ngOnInit() {
    this.loading.show();
    this.hands = await this.storage.get(environment.fingers_storage);
    // Recupero las huellas guardadas en el storage generadas en user-fingers
    this.mapaFingers.set('leftIndex', this.hands.left_index.content);
    this.mapaFingers.set('rightIndex', this.hands.right_index.content);

    this.dataPerson = await this.storage.get(environment.dataOcr);
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.person = await this.storage.get(environment.person);
    // Se ejecuta el servicio de consulta al ine cuando se entra a la page
    this.consultaIne();
    
  }

  private consultaIne() {
    if(this.falloIne) {
      this.loading.show();
    }
    this.serv_ine.queryIne(this.mapaFingers, this.dataPerson, this.token, this.operation.operationId, this.operation.systemCode)
                .subscribe(result => {
                console.log('CONSULTA INE ', result);
                this.mapaFingers.clear();
                this.loading.hide();
                
                if(result['code'] == -9999) {
                  this.data.nombre = this.dataPerson.nombre;
                  this.data.aPaterno = this.dataPerson.aPaterno;
                  this.data.aManterno = this.dataPerson.aMaterno;
                  this.data.ocr = this.dataPerson.ocr;
                  let porcentaje: string = ((+result['data']['response']['minutiaeResponse']['similitud2'].substring(0, result['data']['response']['minutiaeResponse']['similitud2'].length - 1) + +result['data']['response']['minutiaeResponse']['similitud7'].substring(0, result['data']['response']['minutiaeResponse']['similitud7'].length - 1))/2).toString();
                  console.log(porcentaje);
                  this.data.similitud = +(porcentaje.substring(0, 5));
                  this.data.aprove = result['data']['response']['status'] === 'Aceptado';
                } else {
                  this.alert.presentAlert('¡Ocurrio un problema!', 'Ocurrio un problema al consultar al INE con los datos obtenidos previamente', '', ['Entiendo']);
                }

              }, error => {
                console.log('CONSULTA INE ERROR ', error);
                this.loading.hide();
                this.falloIne = true;
                this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.consultaIne() });

              });
    
  }

  public back(){
    this.nav.pop();
  }

  public async enroll(){
    if(this.hands.left_index.content && this.hands.right_index.content) {
      this.loading.show();
      // [servicio] implementación de servicio de enrolamiento
      this.biometric_serv.enrollBiometric(this.hands, this.token, this.operation.operationId, this.operation.systemCode, this.login.person, this.login.user, 1)
        .subscribe( data => {
          console.log('Enrroll Fingers  ', data);
          this.loading.hide();
          if(data['code'] === -9999) {
            this.continue();
          } else {
            this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Realice su proceso de registro nuevamente', '', 'Finalizar', () => {
              this.finalizar();
            });
          }
        }, error => {
          this.loading.hide();
          this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.enroll()  });
        });
    } else {
      this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'No se capturaron sus datos correctamente, realice su proceso de registro de nuevo', '', 'Finalizar', () => {
        this.finalizar();
      });
    }
  }

  public continue(): void  {
    // [servicio] enrolamiento de usuario
    this.storage.clear();
    this.nav.navigateRoot('/registerEnd');
  }

  public finalizar(): void  {
    this.storage.clear();
    this.nav.navigateRoot('/registerMain');
  }

}
