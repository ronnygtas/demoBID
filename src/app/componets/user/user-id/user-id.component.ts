import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { CameraComponent } from '../../../bid/components/camera/camera.component';
import { OperationService } from 'src/app/services/custome/operation.service';
import { OcrService } from 'src/app/services/custome/ocr.service';
import { SaveDocService } from 'src/app/services/save-document/save-doc.service';
import { Id } from './Id';
import { LoginModel } from 'src/app/classes/model/login-model';
import { OperationsObj } from 'src/app/classes/model/operations-obj';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { Image } from '../../../bid/components/camera/Camera';
import { CreateBolb } from '../../../classes/util/create-blob';
import { DataClient } from 'src/app/classes/model/data-client';
import { Person } from 'src/app/classes/model/person';

@Component({
  selector: 'app-user-id',
  templateUrl: './user-id.component.html',
  styleUrls: ['./user-id.component.scss'],
})
export class UserIdComponent implements OnInit {

  variable: number;
  public data: Id;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  public cameraNames: string[] = ['Anverso','Reverso'];
  public cameraPasaporte: string[] = ['Pasaporte'];
  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  private dataClient: DataClient;
  private person: Person;

  public ext: boolean = false;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  @ViewChild(CameraComponent, {static: true}) camera: CameraComponent;

  private operationId: number;
  private documentos: any[] = [];
  private count: number = 0;
  public tipoID: string;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private opId_serv: OperationService,
              private ocr_serv: OcrService,
              private save_doc: SaveDocService) {

    this.data = new Id();
    this.loading = new LoadingComponent();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.dataClient = await this.storage.get(environment.dataClient);
    this.person = await this.storage.get(environment.person);
    this.tipoID = 'ine';
    this.loading.hide();
  }

  public getImage(imagen: Image){
    if(imagen.numero == 0){
      this.data.front = imagen.content;
      this.data.frontRaw = imagen.raw;
    }else if(imagen.numero == 1){
      this.data.back = imagen.content;
      this.data.backRaw = imagen.raw;
    }
  }

  public precallOCR(){
    if(this.tipoID !== 'ine'){this.data.direction = false;}
    this.storage.save(environment.front_id, this.data.frontRaw);
    this.storage.save(environment.id_kind, this.tipoID);
    if(this.tipoID == 'ine'){
      this.callOCR();
    }else if(this.tipoID === 'pass'){
      this.callOCRPass();
    }else if(this.tipoID === 'fm2'){
      this.callOCRFM();
    }else{
      this.alert.presentAlert('Error', 'No has seleccionado ningun tipo de identificación', 'Selecciona una opción para continuar', ['OK']);
    }
  }

  public callOCR() {
    if(this.data.back && this.data.front) {
      this.loading.show();
      this.operationId = this.operation.operationId;
      this.ocr_serv.ine_Ocr(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512), CreateBolb.b64toBlob(this.data.backRaw, 'image/jpeg', 512), this.token, this.operation.operationId);
      // Llenando array de los datos que se necesitan mandar al servicio de guardado de Doc
      this.documentos.push(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512));
      this.documentos.push(CreateBolb.b64toBlob(this.data.backRaw, 'image/jpeg', 512));
      this.loading.hide();
      this.saveDocumentos();
    }else{
      this.alert.presentAlert('Error', 'No has insertado ambas imagenes correctamente', 'Ingresa ambos lados de tu identificación para continuar', ['OK']);
    }
  }

  public callOCRPass() {
    if(this.data.front) {
      this.loading.show();
      this.operationId = this.operation.operationId;
      this.ocr_serv.pass_Ocr(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512), this.token, this.operation.operationId);
      // Llenando array de los datos que se necesitan mandar al servicio de guardado de Doc
      this.documentos.push(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512));
      this.loading.hide();
      this.saveDocumentos();
    }else{
      this.alert.presentAlert('Error', 'No has insertado ninguna imagen', 'Ingresa la imagen para continuar', ['OK']);
    }
  }

  public callOCRFM() {
    if(this.data.back && this.data.front) {
      this.loading.show();
      this.operationId = this.operation.operationId;
      this.ocr_serv.ine_Ocr(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512), CreateBolb.b64toBlob(this.data.backRaw, 'image/jpeg', 512), this.token, this.operation.operationId);
      // Llenando array de los datos que se necesitan mandar al servicio de guardado de Doc
      this.documentos.push(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512));
      this.documentos.push(CreateBolb.b64toBlob(this.data.backRaw, 'image/jpeg', 512));
      this.loading.hide();
      this.saveDocumentos();
    }else{
      this.alert.presentAlert('Error', 'No has insertado ambas imagenes correctamente', 'Ingresa ambos lados de tu identificación para continuar', ['OK']);
    }
  }

  private saveDocumentos() {
    // Servicio de guardado de documentos especificando el nombre que se le dara a cada uno
    this.save_doc.saveDocument(this.documentos[this.count], this.count == 0 ? 'IneAnverso' : 'IneReverso', this.operationId, this.token)
    .subscribe( data => {
      console.log('SAVE DOC ', data);
      if(this.count >= 1) {} else {
        this.count ++;
        this.saveDocumentos();
      }
    }, async error => {
      console.log('SAVE DOC ERROR ', error);
    });
    this.storage.save(environment.same_adress, this.data.direction);
    if(this.data.direction){
      this.continueFast();
    }else{
      this.continue();
    }
  }

  public back(){
    this.nav.pop();
  }

  public continue(): void{
    this.nav.navigateForward('/userAdress');
  }

  public continueFast(): void {
    this.nav.navigateForward('/userEnroll');
  }

  public cameraErrorHandler($event){
    this.alert.presentAlert('Error', 'Error de camara', $event, ['OK']);
  }

  public cambio(){
    if(this.ext && this.tipoID === 'ine'){
      this.tipoID = 'pass';
    }else if(this.tipoID === 'fm2'){
      this.tipoID = 'pass';
    }
  }
}
