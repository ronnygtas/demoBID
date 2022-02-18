import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-user-buro',
  templateUrl: './user-buro.component.html',
  styleUrls: ['./user-buro.component.scss'],
})
export class UserBuroComponent implements OnInit {
  fill_p1_s: any; fill_p1_n: any; fill_p2_s: any; fill_p2_n: any; fill_p3_s: any; fill_p3_n: any;
  isValidoP1: boolean; isValidoP2: boolean; isValidoP3: boolean; lic: boolean; folio: any; buroWEB: boolean;
  preg1: boolean; preg2: boolean; preg3: boolean;
  fag3: boolean;
  isValidoBoton: boolean;
  checkprivasidad: boolean;
  isChecked: boolean;
  isValido: boolean;
  tipoPregunta: any; jsonPreguntas: any;
  datos_tracking: any; trackingID: any;
  numTarjeta: string;
  acepta: any;
  pregunta1: any; pregunta2: any; pregunta3: any;
  fecha_hoy: any;
  public logout: string = environment.logo_blanco;

  constructor(public navCtrl: NavController,
    private alertCtrl: AlertController,) { }

  ngOnInit() {
    this.fill_p1_s = 'outline'; this.fill_p1_n = 'outline';
    this.fill_p2_s = 'outline'; this.fill_p2_n = 'outline';
    this.fill_p3_s = 'outline'; this.fill_p3_n = 'outline';
    this.isValidoP1 = false; this.isValidoP2 = false; this.isValidoP3 = false; this.lic = false;
    this.buroWEB = true;
    this.preg1 = false;
    this.preg2 = false;
    this.preg3 = false;
    this.fag3 = false;
    this.isValidoBoton = true;
    this.checkprivasidad = true;
    this.validacionpreg();
  }

  // Alert validacion de preguntas
  async validacionpreg() {
    this.fecha_hoy = new Date();
    const anio = this.fecha_hoy.getFullYear();
    const day = this.fecha_hoy.getDate();
    const month = this.fecha_hoy.getMonth();
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const alert = await this.alertCtrl.create({
      header: '',
      // tslint:disable-next-line:max-line-length
      message: '<div text-center><span>¿Autorizas consultar tu Buró de Crédito?</span>' + '</div><br/> <p  class="font_size_p_alert">Hoy siendo ' + day + ' de ' + meses[month] + ' del ' + anio + ', autoriza a "EMPRESA" a consultar sus antecedentes crediticios por única ocasión ante las Sociedades Información Crediticia que estime conveniente, declarando que conoce la naturaleza, alcance y uso que "EMPRESA" hará de tal información.</p>',
      backdropDismiss: false,
      buttons: [
        {
          text: 'SI, ACEPTO',
          handler: () => {
            this.acepta = '1';
            console.log('Confirm Okay');
        }
        }, {
          text: 'NO, ACEPTO',
          handler: () => {
             this.acepta = '0';
            this.navCtrl.navigateForward('/userDocuments');
          }
        }
      ]
    });
    await alert.present();
  }
  // Validacion de preguntas buro
  validacionform3() {
    if (this.fag3 === true) {
      if ( this.numTarjeta === null && this.numTarjeta === '' || this.numTarjeta === undefined ) {
        this.validacion();
      } else {
       // navegacion a la siguiente pagina
       this.navCtrl.navigateForward('/userDocuments');
      }
    } else {
      // navegacio
      this.navCtrl.navigateForward('/userDocuments');
    }
  }

  validafinal() {
    if (this.preg1 === true && this.preg2 === true && this.preg3 === true) {
      this.isValidoBoton = false;
    } else {
      this.isValidoBoton = true;
    }
  }

  async validacion() {
    const alert = await this.alertCtrl.create({
      // tslint:disable-next-line:max-line-length
      message: '<p>Debes ingresar  los últimos cuatro dígitos de tu tarjeta</p>',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Toggle Preguntas
  togglePregunta1S() {
    if (this.fill_p1_s === 'outline') {
      this.fill_p1_s = 'solid';
      this.fill_p1_n = 'outline';
      this.isValidoP1 = true;
      this.pregunta1 = '1';
      this.preg1 = true;
      this.validafinal();
    } else {
      this.fill_p1_s = 'outline';
      this.fill_p1_n = 'outline';
    }
  }

  togglePregunta1N() {
    if (this.fill_p1_n === 'outline') {
      this.fill_p1_n = 'solid';
      this.fill_p1_s = 'outline';
      this.isValidoP1 = true;
      this.pregunta1 = '0';
      this.preg1 = true;
      this.validafinal();
    } else {
      this.fill_p1_s = 'outline';
      this.fill_p1_n = 'outline';
    }
  }

  togglePregunta2S() {
    if (this.fill_p2_s === 'outline') {
      this.fill_p2_s = 'solid';
      this.fill_p2_n = 'outline';
      this.isValidoP2 = true;
      this.pregunta2 = '1';
      this.preg2 = true;
      this.validafinal();
    } else {
      this.fill_p2_s = 'outline';
      this.fill_p2_n = 'outline';
    }
  }

  togglePregunta2N() {
    if (this.fill_p2_n === 'outline') {
      this.fill_p2_n = 'solid';
      this.fill_p2_s = 'outline';
      this.isValidoP2 = true;
      this.pregunta2 = '0';
      this.preg2 = true;
      this.validafinal();
    } else {
      this.fill_p2_s = 'outline';
      this.fill_p2_n = 'outline';
    }
  }

  togglePregunta3S() {
    if (this.fill_p3_s === 'outline') {
      this.fill_p3_s = 'solid';
      this.fill_p3_n = 'outline';
      this.isValidoP3 = true;
      this.fag3 = true;
      this.pregunta3 = '1';
      this.preg3 = true;
      this.validafinal();
    } else {
      this.fill_p3_s = 'outline';
      this.fill_p3_n = 'outline';
    }
  }

  togglePregunta3N() {
    if (this.fill_p3_n === 'outline') {
      this.fill_p3_n = 'solid';
      this.fill_p3_s = 'outline';
      this.isValidoP3 = true;
      this.fag3 = false;
      this.pregunta3 = '0';
      this.preg3 = true;
      this.validafinal();
    } else {
      this.fill_p3_s = 'outline';
      this.fill_p3_n = 'outline';
    }
  }

  back() {
    this.navCtrl.pop();
  }

}
