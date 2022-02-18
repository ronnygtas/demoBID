import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { LoadingComponent } from '../../../bid/components/loading/loading.component';

declare var FacialBidMitek: any;

@Component({
  selector: 'app-user-facial',
  templateUrl: './user-facial.component.html',
  styleUrls: ['./user-facial.component.scss'],
})
export class UserFacialComponent implements OnInit {

  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;
  public selfie: string = environment.logo_face;

  @ViewChild(LoadingComponent, {static: true}) loading: LoadingComponent;

  public face: string;

  constructor(private nav: NavController,
    private alert: AlertService,
    private storage: StorageService) {
    this.face = '';
  }

  ngOnInit() {}

  public facialCapture(){
    if(FacialBidMitek != null && FacialBidMitek != undefined){
      FacialBidMitek.coolMethod([], data => {
        this.face = data;
        this.continue();
      }, error => {
        this.alert.presentAlert('Error', 'Error al capturar tu rostro', 'Captura de nuevo tu rostro para poder continuar', ['OK']);
      });
    } else {
      console.log('plugin idefinido');
    }
  }

  public back(){
    this.nav.pop();
  }

  public continue(){
    if(this.face){
      this.storage.save(environment.face_storage, this.face);
      this.nav.navigateForward('/userOcr');
    }else{
      this.alert.presentAlert('Error', 'No has capturado tu rostro', 'Captura tu rostro para poder continuar', ['OK']);
    }
  }

}
