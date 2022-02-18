import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ModalComponent } from 'src/app/bid/components/modal/modal.component';


@Component({
  selector: 'app-user-privacy',
  templateUrl: './user-privacy.component.html',
  styleUrls: ['./user-privacy.component.scss'],
})
export class UserPrivacyComponent implements OnInit {
  isChecked: boolean;
  isValido: boolean;
  public logout: string = environment.logo_blanco;

  constructor(private navCtrl: NavController) { 
    this.isChecked = false;
    this.isValido = true;
  }

  ngOnInit() {}

  
  aceptarAvisoProvacidad() {
    if (this.isChecked  === true) {
      this.isValido = false;
    } else {
      this.isValido = true;
    }
  }

  clickAceptarAvisoProvacidad() {
    if (this.isChecked  === true) {
      this.isChecked = false;
      this.isValido = false;
    } else {
      this.isChecked = true;
      this.isValido = true;
    }
  }

  public back(){
    this.navCtrl.pop();
  }

  goUserDocuments() {
    this.navCtrl.navigateForward('/userFingers');
  }

}
