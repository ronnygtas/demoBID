import { Component, OnInit, ViewChild } from '@angular/core';
import { Hands } from 'src/app/bid/components/enrollment/hands';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.scss'],
})
export class TesterComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  public left(control: Hands){}

  public right(control: Hands){}

}
