import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { Ocr } from '../../../classes/model/ocr';
import { LoginModel } from 'src/app/classes/model/login-model';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { DataClient } from 'src/app/classes/model/data-client';
import { OcrService } from '../../../services/custome/ocr.service';
import { UpdatePersonService } from '../../../services/updatePerson/update-person.service';
import { DualData } from 'src/app/classes/util/dual-data';
import { ServicesExService } from 'src/app/bid/services/services-ex.service';
import { HttpHeaders } from '@angular/common/http';
import { Person } from 'src/app/classes/model/person';
import { Adress } from 'src/app/classes/model/adress';
import { OperationsObj } from 'src/app/classes/model/operations-obj';

@Component({
  selector: 'app-user-ocr',
  templateUrl: './user-ocr.component.html',
  styleUrls: ['./user-ocr.component.scss'],
})
export class UserOcrComponent implements OnInit {

  public data: Ocr;
  public dataAdress: Adress;
  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  private token: string;
  private login: LoginModel;
  private operation: OperationsObj;
  private person: Person;
  private same_adress: boolean;
  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;
  private clientData: DataClient = new DataClient();
  public showedINE: boolean = true;

  public countrys: DualData[] = [];
  public states: DualData[] = [];
  public citys: DualData[] = [];
  public towns: DualData[] = [];

  constructor(private nav: NavController,
              private alert: AlertService,
              private storage: StorageService,
              private serv_ocr: OcrService,
              private serv_update: UpdatePersonService,
              private serv: ServicesExService) {

    this.data = new Ocr();
    this.dataAdress = new Adress();
    this.loading = new LoadingComponent();
  }

  async ngOnInit() {
    this.loading.show();
    this.token = await this.storage.get(environment.token);
    this.login = await this.storage.get(environment.session);
    this.operation = await this.storage.get(environment.operation);
    this.clientData = await this.storage.get(environment.dataClient);
    this.person = await this.storage.get(environment.person);
    this.same_adress = await this.storage.get(environment.same_adress);
    this.data.tipoID = await this.storage.get(environment.id_kind);
    this.showedINE = this.data.tipoID === 'ine';
    console.log('TIPO IDENTIFICACION: ', this.data.tipoID);
    // [servicio] esperar datos de ocr
    this.cat_country();
    this.cat_state();
    this.getOcr();
  }

  public cat_country(){
    const headers = {headers: new HttpHeaders().set('authorization', 'Bearer ' + this.token)};
    this.serv.get(environment.servicesURL + environment.cat_country, headers).subscribe(data => {
      console.log(data);
      if(data.code == -9999){
        this.countrys = [];
        data.data.forEach(e => {
          let dual: DualData = new DualData();
          dual.value = dual.id = e[0];
          dual.name = e[1];
          this.countrys.push(dual);
        });
      }
      this.dataAdress.pais = environment.mexico_id;
    },error => {
      console.log('PAISES: ', error);
    });
  }

  public cat_state(){
    this.loading.show()
    const headers = {headers: new HttpHeaders().set('authorization', 'Bearer ' + this.token)};
    this.serv.get(environment.servicesURL + environment.cat_state /*+ '&filter=' + this.data.country*/, headers).subscribe(data => {
      if(data.code == -9999){
        this.states = [];
        data.data.forEach(e => {
          let dual: DualData = new DualData();
          dual.value = dual.id = e[0];
          dual.name = e[1];
          this.states.push(dual);
        });
      }
    },  error => {
      console.log('ESTADOS: ', error);
    });
  }

  public cat_city(){
    const headers = {headers: new HttpHeaders().set('authorization', 'Bearer ' + this.token)};
    this.serv.get(environment.servicesURL + environment.cat_city + this.dataAdress.estado, headers).subscribe(data => {
      if(data.code == -9999){
        this.citys = [];
        data.data.forEach(e => {
          let dual: DualData = new DualData();
          dual.value = dual.id = e[0];
          dual.name = e[1];
          this.citys.push(dual);
        });
      }
    },error => {
      console.log('CIUDADES: ', error);
    });
  }

  public cat_town(){
    const headers = {headers: new HttpHeaders().set('authorization', 'Bearer ' + this.token)};
    this.serv.get(environment.servicesURL + environment.cat_city + this.dataAdress.ciudad, headers).subscribe(data => {
      if(data.code == -9999){
        this.towns = [];
        data.data.forEach(e => {
          let dual: DualData = new DualData();
          dual.value = dual.id = e[0];
          dual.name = e[1];
          this.towns.push(dual);
        });
      }
    },error => {
      console.log('TOWNS: ', error);
    });
  }

  private async getOcr()  {
    return setTimeout(() => {
      if(this.same_adress){
        if(this.serv_ocr.finish){
          this.data = this.serv_ocr.resulDto;
          this.dataAdress.calle = this.data.address;
          this.data.allData();
          this.serv_ocr.completeAdress(this.dataAdress.calle);
          this.same_adress = false;
          this.getOcr();
        }else{this.getOcr();}
      } else  {
        if(this.serv_ocr.finish && this.serv_ocr.finishCD){
          this.data = this.serv_ocr.resulDto;
          this.dataAdress = this.serv_ocr.resulCD;
          this.data.allData();
          this.loading.hide();
        }else{this.getOcr();}
      }
    }, environment.ocr_timeout);
  }

  public saveOCR()  {
    this.loading.show();
    if(this.data.allData() && this.dataAdress.allParams()) {
      // [servicio] actualizacion de datos de person
      this.serv_ocr.curpRenapo(this.data.curp, this.operation.operationId, this.token).subscribe((curp)=>{
        console.log('CURP RENAPO: ', curp);
        if(curp['data']['resultado']['estatus'] === 'OK'){
          this.serv_update.updatePersona(this.data, this.token, this.person.id, this.operation)
          .subscribe(result => {
            console.log('SAVE PERSON ', result);
            this.storage.save(environment.dataOcr, this.data);
            this.serv_update.saveAdressPerson(this.dataAdress, this.token, this.person.id)
              .subscribe( data => {
                console.log('UPDATE ADRESS  ', data);
                if(data['code'] === -9999){
                  this.storage.save(environment.person_adress, this.dataAdress);
                  this.loading.hide();
                  this.continue();
                } else {
                  this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Se presento un problema al querer crear sus datos, por favor para poder avanzar de clic en Reitentar', 'Reitentar', ()=> { this.saveOCR()  });
                }
              }, error => {
                console.log('UPDATE ADRESS ERROR  ', error);
                this.loading.hide();
                this.alert.alertaNoDismiss('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', 'Reitentar', ()=> { this.saveOCR()  });
            
              });
          }, error => {
            console.log('SAVE PERSON ERROR  ', error);
            this.loading.hide();
            this.alert.presentAlertSimpleConfirm('¡Ocurrio un problema!', 'Esta ocurrioendo un problema de conexion', '', 'Reitentar', ()=> { this.saveOCR()  });
          });
        }else{
          this.alert.presentAlert('Error', 'Error en lso datos de entrada', 'Tu CURP no fue encontrado valido, intenta ingresarlo nuevamente', ['OK']);
          this.loading.hide();
        }
      }, error =>{
        this.alert.presentAlert('Error', 'Error en lso datos de entrada', 'Intenta de nuevo', ['OK']);
        this.loading.hide();
      });
    } else  {
      this.loading.hide();
      this.alert.presentAlert('Error', 'Error en los datos ingresados', 'Asegurate de que los datos ingresados son correctos o cumplen con los formatos correctos', ['OK']);
    }
  }

  public back(){
    this.nav.pop();
  }

  public continue(): void{
    this.nav.navigateForward('/userINE');
  }

}
