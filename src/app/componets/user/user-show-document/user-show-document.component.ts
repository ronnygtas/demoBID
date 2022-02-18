import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';
import { ReadDocument } from '../../../services/readDocument/readDocument.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-user-show-document',
  templateUrl: './user-show-document.component.html',
  styleUrls: ['./user-show-document.component.scss'],
})
export class UserShowDocumentComponent implements OnInit {

  public logout: string = environment.logo_blanco;
  data: any;
  pdf: any;

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
    this.pdf = await this.storage.get(environment.pdfDoc);
    // this.pdf = "";
    console.log('PDF', this.pdf);
  }

  public back(){
    this.nav.pop();
  }

}
