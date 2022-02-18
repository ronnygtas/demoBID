import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../bid/services/alert.service';
import { StorageService } from '../../../bid/services/storage.service';
import { SignComponent } from '../../../bid/components/sign/sign.component';


@Component({
  selector: 'app-user-sign',
  templateUrl: './user-sign.component.html',
  styleUrls: ['./user-sign.component.scss'],
})
export class UserSignComponent implements OnInit {

  private sign: SignComponent;

  constructor(
    private nav: NavController,
    private alert: AlertService,
    private storage: StorageService
  ) { }

  ngOnInit() {}

  public back(){
    this.nav.pop();
  }

  public async continuar(){
    
    await this.sign.saveImage();
    
  }
}
