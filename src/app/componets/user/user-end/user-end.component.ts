import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-end',
  templateUrl: './user-end.component.html',
  styleUrls: ['./user-end.component.scss'],
})
export class UserEndComponent implements OnInit {

  public logo: string = environment.logo;
  public logout: string = environment.logo_blanco;

  constructor(private nav: NavController) {}

  ngOnInit() {}

  public back(){
    this.nav.pop();
  }

  public continue(){
    this.nav.navigateRoot('/userMain');
  }

}
