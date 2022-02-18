import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-terms',
  templateUrl: './user-terms.component.html',
  styleUrls: ['./user-terms.component.scss'],
})
export class UserTermsComponent implements OnInit {
  checkP1: boolean; checkP2: boolean; checkP3: boolean; checkP4: boolean; checkP5: boolean; checkP6: boolean;
  isValido: boolean;
  public logout: string = environment.logo_blanco;

  constructor(private navCtrl: NavController) {
    this.checkP1 = false; 
    this.checkP2 = false; 
    this.checkP3 = false; 
    this.checkP4 = false; 
    this.checkP5 = false; 
    this.checkP6 = false; 
    this.isValido = true;
   }

  ngOnInit() {}

  aceptarAvisoPrivacidad() {
    if (this.checkP1 && this.checkP4 && this.checkP5 && this.checkP6 === true) {
      this.isValido = false;
    } else {
      this.isValido = true;
    }
  }

  clickAceptarAvisoPrivacidad1() {
    if (this.checkP1 === true) {
      this.checkP1 = false;
      this.isValido = false;
    } else {
      this.checkP1 = true;
      this.isValido = true;
    }
  }

  clickAceptarAvisoPrivacidad2() {
    if (this.checkP2 === true) {
      this.checkP2 = false;
      this.isValido = false;
    } else {
      this.checkP2 = true;
      this.isValido = true;
    }
  }

  clickAceptarAvisoPrivacidad3() {
    if (this.checkP3 === true) {
      this.checkP3 = false;
      this.isValido = false;
    } else {
      this.checkP3 = true;
      this.isValido = true;
    }
  }

  clickAceptarAvisoPrivacidad4() {
    if (this.checkP4 === true) {
      this.checkP4 = false;
      this.isValido = false;
    } else {
      this.checkP4 = true;
      this.isValido = true;
    }
  }

  clickAceptarAvisoPrivacidad5() {
    if (this.checkP5 === true) {
      this.checkP5 = false;
      this.isValido = false;
    } else {
      this.checkP5 = true;
      this.isValido = true;
    }
  }
  
  clickAceptarAvisoPrivacidad6() {
    if (this.checkP6 === true) {
      this.checkP6 = false;
      this.isValido = false;
    } else {
      this.checkP6 = true;
      this.isValido = true;
    }
  }

  public back(){
    this.navCtrl.pop();
  }

  goUserOtp() {
    this.navCtrl.navigateForward('/userOtp');
  }

}
