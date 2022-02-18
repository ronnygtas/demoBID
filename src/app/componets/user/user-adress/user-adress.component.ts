import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Image } from '../../../bid/components/camera/Camera';
import { LoginModel } from 'src/app/classes/model/login-model';
import { CameraComponent } from '../../../bid/components/camera/camera.component';
import { OperationsObj } from 'src/app/classes/model/operations-obj';
import { Adress } from '../../../classes/model/adress';
import { SaveDocService } from '../../../services/save-document/save-doc.service';
import { CreateBolb } from '../../../classes/util/create-blob';
import { environment } from 'src/environments/environment';
import { OcrService } from '../../../services/custome/ocr.service';
import { UpdatePersonService } from '../../../services/updatePerson/update-person.service';
import { DataClient } from '../../../classes/model/data-client';
import { ServicesExService } from '../../../bid/services/services-ex.service';
import { DualData } from '../../../classes/util/dual-data';
import { Person } from 'src/app/classes/model/person';

@Component({
  selector: 'app-user-adress',
  templateUrl: './user-adress.component.html',
  styleUrls: ['./user-adress.component.scss'],
})
export class UserAdressComponent implements OnInit {

  public dataAdress: Adress;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  public cameraNames: string[] = ['Comprobante'];
  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  private clienData: DataClient;
  private person: Person;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  @ViewChild(CameraComponent, {static: true}) camera: CameraComponent;
  private fileBlob: any;

  public countrys: DualData[] = [];
  public states: DualData[] = [];
  public citys: DualData[] = [];
  public towns: DualData[] = [];

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private serv_saveDoc: SaveDocService,
              private serv_ocr: OcrService,
              private serv_updateA: UpdatePersonService,
              private serv: ServicesExService) {

    this.dataAdress = new Adress();
    this.loading = new LoadingComponent();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.operation = await this.storage.get(environment.operation);
    this.clienData = await this.storage.get(environment.dataClient);
    this.login = await this.storage.get(environment.session);
    this.person = await this.storage.get(environment.person);
    this.loading.hide();
  }

  public back(){
    this.nav.pop();
  }

  public getImage(imagen: Image)  {
    this.dataAdress.comprobante = imagen.content;
    this.dataAdress.comprobanteRaw = imagen.raw;
  }

  public call_ocr(){
    if(this.dataAdress.comprobante){
      let documento: any[] = [];
      documento.push(this.dataAdress.comprobanteRaw);
      this.fileBlob = CreateBolb.b64toBlob(this.dataAdress.comprobanteRaw, 'image/jpeg', 512);
      documento.push(this.fileBlob);
      // Se ejecuta el servicio del Ocr del CD en segundo plano
      this.serv_ocr.comprobanteDomicilioOcr(documento, this.token, this.operation.operationId);
      this.continue();
    }else{
      this.alert.presentAlert('Error', 'Error en los parametros', 'No has ingresado un comprobante de domicilio, intentalo de nuevo', ['OK']);
    }
  }

  private async getDataCD() {
    return setTimeout(() => {
      if(this.serv_ocr.finishCD){
        this.loading.hide();
        this.dataAdress = this.serv_ocr.resulCD;
      } else  {
        this.getDataCD();
      }
    }, 10000);

  }

  public async guardarDireccion() {
    if(this.dataAdress.allParams()){
      this.saveCD();
    } else  {
      this.alert.presentAlert('Error', 'No has ingresado los parametros', 'Ingresa las imagenes necesarias para continuar', ['OK']);
    }
  }

  private saveCD() {
    this.loading.show();
    // Servicio de guardado de comprovante de domicilio
    this.serv_saveDoc.saveDocument(this.fileBlob, 'Comprobante de Domicilio', this.clienData.operationId, this.token)
                  .subscribe( data => {
                    console.log('SAVE DOC CD ', data);

                    if(data['code'] === -9999) {
                      this.saveAdress();
                      
                    } else {
                      this.saveAdress();
                      // this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion, ¿Volver a intentar?', '', 'Si', ()=>{  this.saveCD() });
                    }
                    
                  }, async error => {
                    console.log('SAVE DOC ERROR CD ', error);
                    this.loading.hide();
                    this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion, ¿Volver a intentar?', '', 'Si', ()=>{  this.saveCD() });
                    
                  });
  }

  private saveAdress() {
      // Guardar toda la informacion de la direccion del cliente respecto a su registro de person en la BD
      this.serv_updateA.saveAdressPerson(this.dataAdress, this.token, this.clienData.personId)
                    .subscribe( data => {
                      console.log('UPDATE ADRESS  ', data);
                      this.loading.hide();

                      if(data['code'] === -9999){
                        this.storage.save(environment.person_adress, this.dataAdress);
                        this.continue();

                      } else {
                        this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Se presento un problema al querer crear sus datos, por favor para poder avanzar de clic en Reitentar', 'Reitentar', ()=> { this.saveAdress()  });

                      }
                      

                    }, error => {
                      console.log('UPDATE ADRESS ERROR  ', error);
                      this.loading.hide();
                      this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', 'Reitentar', ()=> { this.saveAdress()  });

                    });

  }

  public continue(): void {
    this.nav.navigateForward('/userEnroll');
  }

}
