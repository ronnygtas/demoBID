import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { ReadDocument } from '../../../services/readDocument/readDocument.service';


@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.scss'],
})
export class UserDocumentsComponent implements OnInit {

  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  documentCode: string;
  token: any;
  pdf: any;
  credit: any;
  dataClient: any;
  x: any;

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
    this.token = await this.storage.get(environment.token);
  }


  public reedValue(event) {

    this.documentCode = event.path[4].attributes[3].value;
    this.loading.show();
   
    this.readDoc.generaDoc(this.documentCode, this.token).subscribe(result =>{
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

  public firma_autografa() {
    // this.nav.navigateRoot('/userSign');
    this.nav.navigateForward('userTerms');
  }

  pdfObj(data) {
    const pdfObj = {
      data: {
        pdf: data
      }
    };

    console.log(pdfObj);
    return pdfObj;

  }

}
