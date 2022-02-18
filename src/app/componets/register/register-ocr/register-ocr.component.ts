import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Ocr } from '../../../classes/model/ocr';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { environment } from 'src/environments/environment';
import { LoginModel } from 'src/app/classes/model/login-model';
import { AlertService } from 'src/app/bid/services/alert.service';
import { StorageService } from 'src/app/bid/services/storage.service';
import { OcrService } from 'src/app/services/custome/ocr.service';
import { UpdatePersonService } from '../../../services/updatePerson/update-person.service';
import { OperationsObj } from '../../../classes/model/operations-obj';

@Component({
  selector: 'app-register-ocr',
  templateUrl: './register-ocr.component.html',
  styleUrls: ['./register-ocr.component.scss'],
})
export class RegisterOcrComponent implements OnInit {

  public data: Ocr;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;
  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  public respondio: boolean;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private serv_ocr: OcrService,
              private serv_update: UpdatePersonService) {

    this.data = new Ocr();
    this.loading = new LoadingComponent();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    //this.person = await this.storage.get(environment.person);
    this.getOcr();
  }

  private async getOcr()  {
    return setTimeout(() => {
      if(this.serv_ocr.finish){
        // console.log('TERMINO, YAY!');
        this.data = this.serv_ocr.resulDto;
        this.data.allData();
        this.loading.hide();
      } else  {
        this.getOcr();
      }
    }, environment.ocr_timeout);
  }


  public saveOCR()  {
    this.loading.show();
    if(this.data.allData()) {
      // [servicio] actualizacion de datos de person
      this.storage.save(environment.dataOcr, this.data);
      this.serv_update.updatePersona(this.data, this.token, this.login.person, this.operation)
        .subscribe(data => {
          console.log('SAVE PERSON ', data);
          this.loading.hide();
          if(data['code'] == environment.okCode){
            this.continue();
          }else{
            this.alert.presentAlertSimpleConfirm('Error', 'Error al guardar los datos', 'Intente guardar los datos nuevamente', 'Reintentar', () => {this.saveOCR()});
          }
        }, error => {
          console.log('SAVE PERSON ERROR  ', error);
          this.loading.hide();
          this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.saveOCR()  });
        });
      
    }else{
      this.loading.hide();
      this.alert.presentAlert('Error', 'Error en los datos ingresados', 'Asegurate de que los datos ingresados son correctos o cumplen con los formatos correctos', ['OK']);
    }
  }

  public back(){
    this.nav.pop();
  }

  public continue(): void{
    this.nav.navigateForward('/registerINE');
  }
}
