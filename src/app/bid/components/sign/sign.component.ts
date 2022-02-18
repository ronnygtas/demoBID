import { Component, OnInit, ViewChild, Renderer } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from '../../../bid/services/storage.service';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit {

  public undo: boolean = true;
  public background: boolean = false;

  @ViewChild('myCanvas', {static: false}) canvas: any;

  canvasElement: any;
  lastX: number;
  lastY: number;

  currentColour: string = '#000';
  brushSize: number = 2;

  constructor(private nav: NavController,public platform: Platform, public renderer: Renderer, private storage: StorageService) {
      console.log('Hello CanvasDraw Component');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){

      this.canvasElement = this.canvas.nativeElement;

      this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
      this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');

  }

  handleStart(ev){

      this.lastX = ev.touches[0].pageX;
      this.lastY = ev.touches[0].pageY;
  }

  handleMove(ev){

      let ctx = this.canvasElement.getContext('2d');
      let currentX = ev.touches[0].pageX;
      let currentY = ev.touches[0].pageY;

      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
      ctx.strokeStyle = this.currentColour;
      ctx.lineWidth = this.brushSize;
      ctx.stroke();       

      this.lastX = currentX;
      this.lastY = currentY;

  }

  clearCanvas(){
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);   
  }

  public saveImage(){
    const firma = this.canvasElement.toDataURL();
    var b64 = firma.split('base64,')[1];
    this.storage.save(environment.firmaAuth, b64);
    console.log("Firma: "+b64);
    this.nav.navigateForward('/userFingerSign');
  }

}
