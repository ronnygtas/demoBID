import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-end',
  templateUrl: './register-end.component.html',
  styleUrls: ['./register-end.component.scss'],
})
export class RegisterEndComponent implements OnInit {

  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  constructor(private nav: NavController) { }

  ngOnInit() {}

  public finalizar(){
    this.nav.navigateRoot('main');
  }

  public back(){
    this.nav.pop();
  }

}
