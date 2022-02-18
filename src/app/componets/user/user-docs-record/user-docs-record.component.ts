import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { ReadDocument } from '../../../services/readDocument/readDocument.service';

@Component({
  selector: 'app-user-docs-record',
  templateUrl: './user-docs-record.component.html',
  styleUrls: ['./user-docs-record.component.scss'],
})
export class UserDocsRecordComponent implements OnInit {

  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  documentCode: string;
  token: any;
  pdf: any;
  firmaAuth: any;
  firmaBio: any;
  operation: any;
  agente: any;
  disableButton: boolean;
  count: any;

  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  constructor(
    private nav: NavController,
    private alert: AlertService,
    private readDoc: ReadDocument,
    private storage: StorageService
  ) {
    this.loading = new LoadingComponent();
   }

  async ngOnInit() {
    this.firmaAuth = await this.storage.get(environment.firmaAuth);
    this.firmaBio = await this.storage.get(environment.firmaBio);
    this.token = await this.storage.get(environment.token);
    this.operation = await this.storage.get(environment.operation);
    this.agente = await this.storage.get(environment.agente);
    console.log('Firma Auth', this.firmaAuth);
    console.log('Firma Bio', this.firmaBio);
    // this.disableButton = true;
  }

  public reedValue(event) {

    this.documentCode = event.path[4].attributes[3].value;
    this.loading.show();
   
    this.readDoc.generaDocFirma(this.documentCode, this.token, this.firmaAuth, this.firmaBio, this.operation.operationId, this.agente.user)
    .subscribe(result =>{
      console.log('Generar Doc Result', result);
      this.pdf = 'data:application/pdf;base64,' + result['data'];
      this.storage.save(environment.pdfDoc, this.pdf);
      this.loading.hide();
      this.nav.navigateForward('/userShowDocument');
    }, error =>{
      console.log('Generar Doc Error', error);
    });
    
  }

  public back(){
    this.nav.pop();
  }

  public continuar(){

    
    this.nav.navigateRoot('/userEnd');

  }

}
