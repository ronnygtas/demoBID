import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Hands } from './hands';
import { Platform } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';

declare var IdentyFingers: any;
declare var FingersBidEnrollment: any;

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
})
export class EnrollmentComponent implements OnInit {

  public options: boolean = false;

  public automatic: boolean = false;
  public hidden: boolean = true;
  public control: Hands;
  public showLeft: boolean = true;
  public showRight: boolean = true;
  private userId = '';
  public swichable: boolean = false;
  public validContent = false;
  public left_check: boolean = true;
  public right_check: boolean = true;

  @Input('automatic') automatic_v: boolean;
  @Input('left') left_v: boolean;
  @Input('right') right_v: boolean;
  @Input('swichable') swichable_v: boolean;
  @Input('icon-class') iconclass: string;
  @Output('onLeft') onLeft = new EventEmitter<Hands>();
  @Output('onRight') onRight = new EventEmitter<Hands>();
  @Output('onBoth') onBoth = new EventEmitter<Hands>();

  constructor(private alert: AlertService,
              public platform: Platform) {
    this.control = new Hands();
  }

  async ngOnInit() {
    this.automatic = this.automatic_v == undefined || this.automatic_v == null ? false : this.automatic_v;
    this.control.left_thumb.show = this.control.left_thumb.active = false;
    this.control.right_thumb.show = this.control.right_thumb.active = false;
    if(this.left_v == false){
      this.showLeft = true;
      this.toggleLeft();
    }else if(this.left_v == true){
      this.showLeft = false;
      this.toggleLeft();
    }else{
      this.showLeft = false;
      this.toggleLeft();
    }
    if(this.right_v == false){
      this.showRight = true;
      this.toggleRight();
    }else if(this.right_v == true){
      this.showRight = false;
      this.toggleRight();
    }else{
      this.showRight = false;
      this.toggleRight();
    }

    if(this.showRight && this.showLeft){
      this.swichable = false;
    }else if(this.swichable_v == null || this.swichable == undefined){
      this.swichable = false;
    }else{
      this.swichable = this.swichable_v;
    }

    if(this.automatic){this.startEnrollment();}
  }

  public initFingers(hands: Hands){
    this.control.left_index.content = hands.left_index.content;
    this.control.left_middle.content = hands.left_middle.content;
    this.control.left_pinky.content = hands.left_pinky.content;
    this.control.left_ring.content = hands.left_ring.content;
    this.control.right_index.content = hands.right_index.content;
    this.control.right_middle.content = hands.right_middle.content;
    this.control.right_pinky.content = hands.right_pinky.content;
    this.control.right_ring.content = hands.right_thumb.content;
  }

  public toggleLeft(){
    this.showLeft = !this.showLeft;
    this.control.left_index.active = this.showLeft;
    this.control.left_middle.active = this.showLeft;
    this.control.left_pinky.active = this.showLeft;
    this.control.left_ring.active = this.showLeft;
    this.control.left_thumb.active = this.showLeft;
  }

  public toggleRight(){
    this.showRight = !this.showRight;
    this.control.right_index.active = this.showRight;
    this.control.right_middle.active = this.showRight;
    this.control.right_pinky.active = this.showRight;
    this.control.right_ring.active = this.showRight;
    this.control.right_thumb.active = this.showRight;
  }

  private toggleMockLeft(){
    this.control.left_index.active = this.left_check;
    this.control.left_middle.active = this.left_check;
    this.control.left_pinky.active = this.left_check;
    this.control.left_ring.active = this.left_check;
    this.control.left_thumb.active = this.left_check;
  }

  private toggleMockRight(){
    this.control.right_index.active = this.right_check;
    this.control.right_middle.active = this.right_check;
    this.control.right_pinky.active = this.right_check;
    this.control.right_ring.active = this.right_check;
    this.control.right_thumb.active = this.right_check;
  }

  public showOptions(){this.options = true;}

  public saveOptions(){this.options = false;}

  public startEnrollment(){
    if (this.platform.is('ios')) {
      this.platform.ready().then(() => {
        if (typeof IdentyFingers !== 'undefined') {
          const encryptionSecret: any = this.userId;
          IdentyFingers.initialize(this.userId,
            (result) => {
              console.log('OnSucces FingersBidEnrollment', result);
            },
            (error) => {
              console.log('OnSucces FingersBidEnrollment', error);
            });
          setInterval(() => {
          }, 100);
        } else {
          alert('Inicializando completomento, por favor vuelva intentarlo.');
        }
      });
    } else {
      let complete_left: boolean = false;
      let complete_right: boolean = false;
      let only_left: boolean = false;
      let only_right: boolean = false;
      if (this.platform.is('android')) {
        this.platform.ready().then(() => {
          if (typeof FingersBidEnrollment !== 'undefined') {
            let params: string[] = [];
            if(this.control.left_index.active &&this.control.left_middle.active &&this.control.left_pinky.active &&this.control.left_ring.active){
              params.push('LEFT_HAND');
              complete_left = true;
              only_left = true;
            }else{
              if(this.control.left_index.active){
                only_left = true;
                params.push(this.control.left_index.canonical);
              }
              if(this.control.left_middle.active){
                only_left = true;
                params.push(this.control.left_middle.canonical);
              }
              if(this.control.left_ring.active){
                only_left = true;
                params.push(this.control.left_ring.canonical);
              }
              if(this.control.left_pinky.active){
                only_left = true;
                params.push(this.control.left_pinky.canonical);
              }
            }
            if(this.control.right_index.active &&this.control.right_middle.active &&this.control.right_pinky.active &&this.control.right_ring.active){
              params.push('RIGHT_HAND');
              only_right = true;
              complete_right = true;
            }else{
              if(this.control.right_index.active){
                only_right = true;
                params.push(this.control.right_index.canonical);
              }
              if(this.control.right_middle.active){
                only_right = true;
                params.push(this.control.right_middle.canonical);
              }
              if(this.control.right_ring.active){
                only_right = true;
                params.push(this.control.right_ring.canonical);
              }
              if(this.control.right_pinky.active){
                only_right = true;
                params.push(this.control.right_pinky.canonical);
              }
            }
            console.log('FINGER CONFIG LIST:: ', params.toString());
            // if(complete_left || complete_right){
            //   if(complete_left && complete_right){
            //     FingersBidEnrollment.initialize(1, (resultBiometric) => {
            //       let validContent = true;
            //       if(this.control.left_index.active){
            //         this.control.left_index.content = JSON.parse(resultBiometric).leftindex;
            //         validContent = validContent && this.control.left_index.content.length > 1;
            //       }
            //       if(this.control.left_middle.active){
            //         this.control.left_middle.content = JSON.parse(resultBiometric).leftmiddle;
            //         validContent = validContent && this.control.left_middle.content.length > 1;
            //       }
            //       if(this.control.left_ring.active){
            //         this.control.left_ring.content = JSON.parse(resultBiometric).leftring;
            //         validContent = validContent && this.control.left_ring.content.length > 1;
            //       }
            //       if(this.control.left_pinky.active){
            //         this.control.left_pinky.content = JSON.parse(resultBiometric).leftlittle;
            //         validContent = validContent && this.control.left_pinky.content.length > 1;
            //       }
    
            //       if(this.control.right_index.active){
            //         this.control.right_index.content = JSON.parse(resultBiometric).rightmiddle;
            //         validContent = validContent && this.control.right_index.content.length > 1;
            //       }
            //       if(this.control.right_middle.active){
            //         this.control.right_middle.content = JSON.parse(resultBiometric).rightmiddle;
            //         validContent = validContent && this.control.right_middle.content.length > 1;
            //       }
            //       if(this.control.right_ring.active){
            //         this.control.right_ring.content = JSON.parse(resultBiometric).rightring;
            //         validContent = validContent && this.control.right_ring.content.length > 1;
            //       }
            //       if(this.control.right_pinky.active){
            //         this.control.right_pinky.content = JSON.parse(resultBiometric).rightlittle;
            //         validContent = validContent && this.control.right_pinky.content.length > 1;
            //       }
    
            //       if(this.validContent){
            //         this.showMark();
            //       }else{
            //         this.hideMark();
            //       }
                  
            //       if(only_right && only_left){
            //         this.onBoth.emit(this.control);
            //       }else if(only_right){
            //         this.onRight.emit(this.control);
            //       }else if(only_left){
            //         this.onLeft.emit(this.control);
            //       }
            //     }, error_initialize => {
            //       console.log('FINGERS CONFIG ERROR:: ' + error_initialize);
            //       this.alert.presentAlert('Error', '¡Ocurrio un problema!', 'Vuelva a capturar sus huellas por favor', ['Entiendo']);
            //     });
            //   }else if(complete_left){
            //     FingersBidEnrollment.initializeVerify(this.userId, 'left', (resultBiometric) => {
            //       let validContent = true;
            //       if(this.control.left_index.active){
            //         this.control.left_index.content = JSON.parse(resultBiometric).leftindex;
            //         validContent = validContent && this.control.left_index.content.length > 1;
            //       }
            //       if(this.control.left_middle.active){
            //         this.control.left_middle.content = JSON.parse(resultBiometric).leftmiddle;
            //         validContent = validContent && this.control.left_middle.content.length > 1;
            //       }
            //       if(this.control.left_ring.active){
            //         this.control.left_ring.content = JSON.parse(resultBiometric).leftring;
            //         validContent = validContent && this.control.left_ring.content.length > 1;
            //       }
            //       if(this.control.left_pinky.active){
            //         this.control.left_pinky.content = JSON.parse(resultBiometric).leftlittle;
            //         validContent = validContent && this.control.left_pinky.content.length > 1;
            //       }
    
            //       if(this.control.right_index.active){
            //         this.control.right_index.content = JSON.parse(resultBiometric).rightmiddle;
            //         validContent = validContent && this.control.right_index.content.length > 1;
            //       }
            //       if(this.control.right_middle.active){
            //         this.control.right_middle.content = JSON.parse(resultBiometric).rightmiddle;
            //         validContent = validContent && this.control.right_middle.content.length > 1;
            //       }
            //       if(this.control.right_ring.active){
            //         this.control.right_ring.content = JSON.parse(resultBiometric).rightring;
            //         validContent = validContent && this.control.right_ring.content.length > 1;
            //       }
            //       if(this.control.right_pinky.active){
            //         this.control.right_pinky.content = JSON.parse(resultBiometric).rightlittle;
            //         validContent = validContent && this.control.right_pinky.content.length > 1;
            //       }
    
            //       if(this.validContent){
            //         this.showMark();
            //       }else{
            //         this.hideMark();
            //       }
                  
            //       if(only_right && only_left){
            //         this.onBoth.emit(this.control);
            //       }else if(only_right){
            //         this.onRight.emit(this.control);
            //       }else if(only_left){
            //         this.onLeft.emit(this.control);
            //       }
            //     }, error_initialize => {
            //       console.log('FINGERS CONFIG ERROR:: ' + error_initialize);
            //       this.alert.presentAlert('Error', '¡Ocurrio un problema!', 'Vuelva a capturar sus huellas por favor', ['Entiendo']);
            //     });
            //   } else{
            //     FingersBidEnrollment.initializeVerify(this.userId, 'right', (resultBiometric) => {
            //       let validContent = true;
            //       if(this.control.left_index.active){
            //         this.control.left_index.content = JSON.parse(resultBiometric).leftindex;
            //         validContent = validContent && this.control.left_index.content.length > 1;
            //       }
            //       if(this.control.left_middle.active){
            //         this.control.left_middle.content = JSON.parse(resultBiometric).leftmiddle;
            //         validContent = validContent && this.control.left_middle.content.length > 1;
            //       }
            //       if(this.control.left_ring.active){
            //         this.control.left_ring.content = JSON.parse(resultBiometric).leftring;
            //         validContent = validContent && this.control.left_ring.content.length > 1;
            //       }
            //       if(this.control.left_pinky.active){
            //         this.control.left_pinky.content = JSON.parse(resultBiometric).leftlittle;
            //         validContent = validContent && this.control.left_pinky.content.length > 1;
            //       }
    
            //       if(this.control.right_index.active){
            //         this.control.right_index.content = JSON.parse(resultBiometric).rightmiddle;
            //         validContent = validContent && this.control.right_index.content.length > 1;
            //       }
            //       if(this.control.right_middle.active){
            //         this.control.right_middle.content = JSON.parse(resultBiometric).rightmiddle;
            //         validContent = validContent && this.control.right_middle.content.length > 1;
            //       }
            //       if(this.control.right_ring.active){
            //         this.control.right_ring.content = JSON.parse(resultBiometric).rightring;
            //         validContent = validContent && this.control.right_ring.content.length > 1;
            //       }
            //       if(this.control.right_pinky.active){
            //         this.control.right_pinky.content = JSON.parse(resultBiometric).rightlittle;
            //         validContent = validContent && this.control.right_pinky.content.length > 1;
            //       }
    
            //       if(this.validContent){
            //         this.showMark();
            //       }else{
            //         this.hideMark();
            //       }
                  
            //       if(only_right && only_left){
            //         this.onBoth.emit(this.control);
            //       }else if(only_right){
            //         this.onRight.emit(this.control);
            //       }else if(only_left){
            //         this.onLeft.emit(this.control);
            //       }
            //     }, error_initialize => {
            //       console.log('FINGERS CONFIG ERROR:: ' + error_initialize);
            //       this.alert.presentAlert('Error', '¡Ocurrio un problema!', 'Vuelva a capturar sus huellas por favor', ['Entiendo']);
            //     });
            //   }
            // }else{
              FingersBidEnrollment.initializeKaralundiVariable(params.toString(), (resultBiometric) => {
                let validContent = true;
                if(this.control.left_index.active){
                  this.control.left_index.content = JSON.parse(resultBiometric).leftindex;
                  validContent = validContent && this.control.left_index.content.length > 1;
                }
                if(this.control.left_middle.active){
                  this.control.left_middle.content = JSON.parse(resultBiometric).leftmiddle;
                  validContent = validContent && this.control.left_middle.content.length > 1;
                }
                if(this.control.left_ring.active){
                  this.control.left_ring.content = JSON.parse(resultBiometric).leftring;
                  validContent = validContent && this.control.left_ring.content.length > 1;
                }
                if(this.control.left_pinky.active){
                  this.control.left_pinky.content = JSON.parse(resultBiometric).leftlittle;
                  validContent = validContent && this.control.left_pinky.content.length > 1;
                }
  
                if(this.control.right_index.active){
                  this.control.right_index.content = JSON.parse(resultBiometric).rightmiddle;
                  validContent = validContent && this.control.right_index.content.length > 1;
                }
                if(this.control.right_middle.active){
                  this.control.right_middle.content = JSON.parse(resultBiometric).rightmiddle;
                  validContent = validContent && this.control.right_middle.content.length > 1;
                }
                if(this.control.right_ring.active){
                  this.control.right_ring.content = JSON.parse(resultBiometric).rightring;
                  validContent = validContent && this.control.right_ring.content.length > 1;
                }
                if(this.control.right_pinky.active){
                  this.control.right_pinky.content = JSON.parse(resultBiometric).rightlittle;
                  validContent = validContent && this.control.right_pinky.content.length > 1;
                }
  
                if(this.validContent){
                  this.showMark();
                }else{
                  this.hideMark();
                }
                
                if(only_right && only_left){
                  this.onBoth.emit(this.control);
                }else if(only_right){
                  this.onRight.emit(this.control);
                }else if(only_left){
                  this.onLeft.emit(this.control);
                }
  
              }, (error_initialize) => {
                console.log('FINGERS CONFIG ERROR:: ' + error_initialize);
                this.alert.presentAlert('Error', '¡Ocurrio un problema!', 'Vuelva a capturar sus huellas por favor', ['Entiendo']);
              });
            // }
          } else {
            this.alert.presentAlert('Error', '¡Ocurrio un problema!', 'Error el levantar los componentes', ['Entiendo']);
          }
        });
      }
    }
  }

  private showMark(){
    this.validContent = true;
  }

  private hideMark(){
    this.validContent = false;
  }

  public leftCheckChange(){
    this.toggleMockLeft();
  }

  public rightCheckChange(){
    this.toggleMockRight();
  }

  swich(){
    this.toggleLeft();
    this.toggleRight();
  }

}
