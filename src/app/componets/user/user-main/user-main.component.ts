import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ModalActions } from 'src/app/bid/components/modal/modal.classes';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/bid/components/modal/modal.component';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss'],
})
export class UserMainComponent implements OnInit {

  public logo: string = environment.logo;
  public logo_light: string = environment.logo_light;
  public logout: string = environment.logo_blanco;

  public terminos: boolean;

  constructor(private nav: NavController,private modal: ModalController) { }

  ngOnInit() {
    this.terminos = false;
  }

  public back(){
    this.nav.navigateRoot('main');
  }

  public continue(): void{
    // this.nav.navigateRoot('/userPrivacy');
    let actions: ModalActions[] = [];
    let act: ModalActions = new ModalActions();
    act.action = () => {this.nav.navigateForward('/userFingers');};
    act.name = 'Acepto terminos';
    act.styles = '';
    actions.push(act);
    this.presentModal(environment.pol_title, environment.pol_cont, actions);
  }

  private async presentModal(name: string, content: string, actions: ModalActions[]){
    const modal = await this.modal.create({
      component: ModalComponent,
      componentProps: {
        'name': name,
        'content': content,
        'actions': actions
      }
    });
    return await modal.present();
  }

}
