import { Component, OnInit, Input } from '@angular/core';
import { ModalActions } from './modal.classes';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input('name') name: string;
  @Input('content') content: string;
  @Input('actions') actions: ModalActions[];

  constructor(private modal: ModalController) {}

  ngOnInit() {}

  public dismiss(){
    this.modal.dismiss();
  }

}
