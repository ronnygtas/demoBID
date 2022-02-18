import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { environment } from '../../../../environments/environment';
import { LoginModel } from '../../../classes/model/login-model';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { CameraComponent } from '../../../bid/components/camera/camera.component';
import { Image } from '../../../bid/components/camera/Camera';
import { Id } from './id';
import { OperationService } from '../../../services/custome/operation.service';
import { OperationsObj } from '../../../classes/model/operations-obj';
import { OcrService } from '../../../services/custome/ocr.service';
import { SaveDocService } from '../../../services/save-document/save-doc.service';
import { CreateBolb } from '../../../classes/util/create-blob';

@Component({
  selector: 'app-register-id',
  templateUrl: './register-id.component.html',
  styleUrls: ['./register-id.component.scss'],
})
export class RegisterIdComponent implements OnInit {

  public debug: boolean = environment.debug;

  public cameraNames: string[] = ['Anverso','Reverso'];
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;
  public data: Id;

  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  @ViewChild(CameraComponent, {static: true}) camera: CameraComponent;

  imgHeader: any;
  mapaPhoto: any;

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
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.generate_opID();
  }

  public generate_opID() {
    this.loading.show();
    // [servicio] Creacion de operacion
    this.opId_serv.generateOpId(this.token, this.login.user).subscribe( result => {
      if(result['code'] == environment.okCode){
        this.operation = result['data'];
        this.storage.save(environment.operation, this.operation);
        this.loading.hide();
      }else{
        this.alert.presentAlertSimpleConfirm('Error', 'Esta ocurrioendo un problema de conexion', 'Por favor vuelva a intentar', 'Reitentar', ()=>{ this.generate_opID() });
        this.loading.hide();
      }
    }, error => {
      console.log(error);

    });
  }

  public callOCR() {
    if(this.data.back && this.data.front) {
      this.loading.show();
      // [servicio] call OCR y guardar documentos
      this.ocr_serv.ine_Ocr(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512), CreateBolb.b64toBlob(this.data.backRaw, 'image/jpeg', 512), this.token, this.operation.operationId);

      let documentos: any[] = [];
      documentos.push(CreateBolb.b64toBlob(this.data.frontRaw, 'image/jpeg', 512));
      documentos.push(CreateBolb.b64toBlob(this.data.backRaw, 'image/jpeg', 512));
      for(let e = 0; e <= documentos.length; e++) {
        this.save_doc.saveDocument(documentos[e], e == 0 ? 'IneAnverso' : 'IneReverso', this.operation.operationId, this.token)
            .subscribe( data => {
              console.log('SAVE DOC 1 ', data);
              if(e == 1) {
                this.loading.hide();
              }
            }, async error => {
              console.log('SAVE DOC ERROR 1 ', error);
              if(e == 0){
                this.save_doc.saveDocumentResp(this.data.frontRaw, 1, this.operation.operationId, this.token).subscribe((datas) => {
                  console.log('SAVE DOC 2 ', datas);
                }, error => {
                  console.log('SAVE DOC ERROR 2 ', error);
                })
              }else if(e == 1){
                this.save_doc.saveDocumentResp(this.data.backRaw, 1, this.operation.operationId, this.token).subscribe((datas) => {
                  console.log('SAVE DOC 3 ', datas);
                  this.loading.hide();
                }, error => {
                  console.log('SAVE DOC ERROR 3 ', error);
                  this.loading.hide();
                })
              }
            });
      }

      this.continue();
    }else{
      this.alert.presentAlert('Error', 'No has insertado ambas imagenes correctamente', 'Ingresa ambos lados de tu identificación para continuar', ['OK']);
    }
  }

  public getImage(imagen: Image){
    console.log('Se obtubo la imagen');
    if(imagen.numero == 0){
      this.data.front = imagen.content;
      this.data.frontRaw = imagen.raw;
    }else if(imagen.numero == 1){
      this.data.back = imagen.content;
      this.data.backRaw = imagen.raw;
    }
    this.camera.update();
    this.camera.updateImage(imagen);
  }

  public cameraError(error: string){
    this.alert.presentAlert('Error', 'Error de camara', '' + error, ['OK']);
  }

  public back(){
    this.nav.pop();
  }

  public continue(): void{
    this.nav.navigateForward('/registerFingers');
  }
}
