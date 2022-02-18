import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  public loading: boolean = false;

  constructor() { }

  ngOnInit() {}

  public show(){
    this.loading = true;
  }

  public hide(){
    this.loading = false;
  }

}
