import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { Ine } from './ine';
import { LoginModel } from 'src/app/classes/model/login-model';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { ConsultaIneService } from '../../../services/consultaIne/consulta-ine.service';
import { Ocr } from '../../../classes/model/ocr';
import { DataClient } from 'src/app/classes/model/data-client';
import { OperationsObj } from 'src/app/classes/model/operations-obj';
import { Hands } from 'src/app/bid/components/enrollment/hands';
import { BiometricosGeneralService } from 'src/app/services/serv-biometricos/biometricos-general.service';

@Component({
  selector: 'app-user-ine',
  templateUrl: './user-ine.component.html',
  styleUrls: ['./user-ine.component.scss'],
})
export class UserIneComponent implements OnInit {

  public data: Ine = new Ine();
  public dataOcr: Ocr;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  private enroll: boolean;
  private person: any;
  private mapaFingers: any;
  private fingers: Hands;
  private clientData: DataClient = new DataClient();
  private face: string;
  private frontID: string;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  private validaciones: number;

  public tipoID: string;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private serv_ine: ConsultaIneService,
              private biometric_serv: BiometricosGeneralService) {

    this.data = new Ine();
    this.loading = new LoadingComponent();
    this.mapaFingers = new Map();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.person = await this.storage.get(environment.person);
    this.dataOcr = await this.storage.get(environment.dataOcr);
    this.clientData = await this.storage.get(environment.dataClient);
    this.face = await this.storage.get(environment.face_storage);
    this.enroll = await this.storage.get(environment.enroll);
    this.frontID = await this.storage.get(environment.front_id);

    this.fingers = await this.storage.get(environment.hand);
    this.tipoID = await this.storage.get(environment.id_kind);

    this.mapaFingers.set('leftIndex', this.fingers.left_index.content);
    this.mapaFingers.set('rightIndex', this.fingers.right_index.content);

    this.consultaIne();
  }

  private consultaIne() {
    //  Servicio de consulta al INE con los datos del cliente
    this.serv_ine.queryIne(this.mapaFingers, this.dataOcr, this.token, this.operation.operationId, this.operation.systemCode)
                .subscribe(result => {
                console.log('CONSULTA INE ', result);
                this.mapaFingers.clear();
                this.loading.hide();
                
                if(result['code'] == -9999) {

                  if(result['data']['response']['Codigo'] == 500) {
                    // Este error proviene del proveedor FINBE (El back no hace conexcion con su servicio)
                    this.alert.presentAlert('¡Ocurrio un problema!', 'Ocurrio un problema al consultar al INE con los datos obtenidos previamente', '', ['Entiendo']);
                    
                  } else {
                    this.data.nombre = this.dataOcr.nombre;
                    this.data.aPaterno = this.dataOcr.aPaterno;
                    this.data.aManterno = this.dataOcr.aMaterno;
                    this.data.ocr = this.dataOcr.ocr;
                    let val1: number = +result['data']['response']['minutiaeResponse']['similitud2'].substring(0, result['data']['response']['minutiaeResponse']['similitud2'].length - 1);
                    let val2: number = +result['data']['response']['minutiaeResponse']['similitud7'].substring(0, result['data']['response']['minutiaeResponse']['similitud7'].length - 1);
                    let porcentaje: string = val1 >= val2 ? val1.toString(): val2.toString();
                    console.log(porcentaje);
                    this.data.similitud = +(porcentaje.substring(0, 5));
                    this.data.aprove = result['data']['response']['status'] === 'Aceptado'; 
                  }
                } else {
                  this.alert.presentAlert('¡Ocurrio un problema!', 'Ocurrio un problema al consultar al INE con los datos obtenidos previamente', '', ['Entiendo']);
                }

              }, error => {
                console.log('CONSULTA INE ERROR ', error);
                this.loading.hide();
                this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurriendo un problema de conexion', '', 'Reitentar', ()=> { this.consultaIne() });

              });
    
  }

  private compareFace(){
    this.biometric_serv.compareFace(this.face, this.frontID, this.operation.operationId, this.token).subscribe((data)=> {
      this.validaciones++;
      if(this.validaciones == 2){this.loading.hide();}
      if(data['code'] == -9999){
        console.log('COMPARE FACE', JSON.stringify(data));
        this.data.face = true;
        this.data.similitudFace = +data['data']['similitud'].substring(0, 4);
      }else{this.data.face = false;}
    }, error => {
      this.alert.presentAlertSimpleConfirm('Error', 'Ocurrio un error al concluir tu proceso, intentalo de nuevo', '', 'Reintentar', () => {this.compareFace();});
    });
  }

  public back(){
    this.nav.pop();
  }

  public continuar(){
      this.loading.show();
      this.biometric_serv.enrollBiometric(this.fingers, this.token, this.operation.operationId, this.operation.systemCode, this.person.id, '', 2)
      .subscribe( result => {
        console.log('ENROLL CLIENT  ', result);
        if(result['code'] === -9999) {
          this.face_enroll();
        } else {
          this.alert.presentAlert('¡Ocurrio un problema!', 'Por favor vuelva a capturar sus huellas para intentar guardarlas nuevamente', '', ['Entiendo']);
        }
        
      }, error => {
        console.log('ENROLL CLIENT ERROR  ', error);
        this.loading.hide();
        this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.continuar()  });
      });
  }

  private face_enroll(){
    this.biometric_serv.faceEnroll(this.face, this.token, this.operation.systemCode, this.operation.operationId).subscribe((data)=> {
      console.log('ENROLAMIENTO FACIAL: ', JSON.stringify(data));
      this.loading.hide();
      this.continue();
    }, error => {
      this.alert.presentAlertSimpleConfirm('Error', 'Ocurrio un error al concluir tu proceso, intentalo de nuevo', '', 'Reintentar', () => {this.face_enroll();});
    })
  }

  public continue(): void{
    this.nav.navigateForward('/userKyc');
  }

  public finalizar(): void{
    this.nav.navigateRoot('/userFingers');
  }

}
