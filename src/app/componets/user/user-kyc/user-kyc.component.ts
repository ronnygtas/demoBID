import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { UserKYC } from './user-kyc';

@Component({
  selector: 'app-user-kyc',
  templateUrl: './user-kyc.component.html',
  styleUrls: ['./user-kyc.component.scss'],
})
export class UserKycComponent implements OnInit {

  public controls: UserKYC;
  public logout: string = environment.logo_blanco;

  constructor(
    private nav: NavController,
    private alert: AlertService,
    private storage: StorageService
  ) { 
    this.controls = new UserKYC();
    this.controls.exposed = 'no';
    this.controls.exposedName = '';
    this.controls.exposedCharge = '';
    this.controls.inmuebles = 0;
    this.controls.inValue = null;
    this.controls.adicionales = 'no';
    this.controls.adEsp = '';
    this.controls.adNeto = '';
    this.controls.auto = 'no';
    this.controls.marca = '';
    this.controls.modelo = '';
    this.controls.ano = '';
    this.controls.valor = '';
  }

  ngOnInit() {}

  public back(){
    this.nav.pop();
  }

  public continuar(): void{
    console.log('Controls', JSON.stringify(this.controls));
    this.storage.save(environment.kyc, this.controls);
    this.nav.navigateForward('/userBuro');
  }

}
