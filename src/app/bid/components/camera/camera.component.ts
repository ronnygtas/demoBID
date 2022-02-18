import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraDto, Image } from './Camera';
import { Events } from '@ionic/angular';

declare var CameraBidMitek: any;

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {

  @Input('name') name: string[];
  @Input('file') file: boolean;
  @Input('buttonsPosition') buttonsPosition: number;
  @Input('height') height: number;
  @Input('messages') messages: string[];
  @Input('imageAction') imageAction: boolean;
  @Input('mitek') mitek: boolean;
  @Output('error') error = new EventEmitter<string>();
  @Output('onImage') onImage = new EventEmitter<Image>();

  public loading: boolean;
  imgHeader: any;
  public image: CameraDto[] = [];
  public showInputfile: boolean;
  public position: string;
  public cameraClass: string;
  public baseHeight: number;
  public useMitek: boolean;

  constructor(private camera: Camera,
    private events: Events,
    private zone: NgZone){
    this.showInputfile = false;
    this.cameraClass = 'camera ';
    this.baseHeight = 30;
  }

  ngOnInit() {
    if(this.name){
      if(this.name.length > 0){
        for(let i = 0; i < this.name.length; i++){
          this.image.push(new CameraDto(this.name[i]));
        }
      }
    }
    if(this.file != null && this.file != undefined){
      this.showInputfile = this.file;
    }
    switch(this.buttonsPosition){
      case 1:
        this.cameraClass += 'position1';
      break;
      case 2:
        this.cameraClass += 'position2';
      break;
      case 3:
        this.cameraClass += 'position3';
      break;
      case 4:
        this.cameraClass += 'position4';
      break;
      default:
        this.cameraClass += 'position2';
      break;
    }
    if(this.height != null && this.height != undefined){
      this.baseHeight = this.height;
    }
    if(!this.imageAction){
      if(this.imageAction != false){
        this.imageAction = true;
      }
    }else{
      this.imageAction = false;
    }
    if(this.mitek == undefined || this.mitek == null){
      this.useMitek = false;
    }else if(this.mitek == false){
      this.useMitek = false;
    }else if(this.mitek){
      this.useMitek = true;
    }else{
      this.useMitek = false;
    }
  }

  listenerImg($event, position: number): void {
    this.loading = true;
    let imagenResult = '';
    let image: any;
    const file: File = $event.target.files[0];

    if ((file.type !== 'image/jpeg' && file.type !== 'image/png') || (file.size > 1000000)) {
      this.emmitError('El formato o peso de imagen que seleccionaste no esta permitido, usa un formato permitido');
      this.loading = false;
    } else {
      const myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        imagenResult = myReader.result.toString();
        this.image[position].content = imagenResult;
        this.imgHeader = imagenResult.split(',')[1];
        this.loading = false;
        this.emmitImage(position);
      };
      myReader.readAsDataURL(file);
    }
  }

  tomarFoto(position: number) {
    let photo: any;
    if(this.useMitek){
      if(CameraBidMitek != null && CameraBidMitek != undefined){
        CameraBidMitek.idFront({}, data => {
          photo = 'data:image/jpeg;base64,' + data;
          this.image[position].raw = data;
          this.image[position].content = photo;
          this.emmitImage(position);
        }, error => {
          this.emmitError('Error al obtener los datos de la imagen');
        });
      }else{
        this.emmitError('No se ha inicializaco el componente de Mitek');
      }
    }else{
      const options: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        cameraDirection: 0
      };
      this.camera.getPicture(options).then((imageData) => {
        photo = 'data:image/jpeg;base64,' + imageData;
        this.image[position].raw = imageData;
        this.image[position].content = photo;
        this.emmitImage(position);
        this.loading = false;
      }, (err) => {
        this.emmitError('Ocurrió un error al tomar la fotografía ' + err);
        this.loading = false;
      });
    }
  }

  public update(){
    if(this.useMitek){
      if(CameraBidMitek != null && CameraBidMitek != undefined){
        CameraBidMitek.coolMethod({}, () => {
          for(let i = 0; i < this.image.length; i++){
            this.image[i].content = this.image[i].content;
          }
        }, () => {});
      }
    }
  }

  public updateImage(image: Image){
    this.image[image.numero].content = image.content;
    this.image[image.numero].raw = image.raw;
  }

  delPhoto(position: number){
    this.image[position].content = null;
    this.emmitImage(position);
  }

  b64toBlob(b64Data: string, contentType: string, sliceSize: number) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  emmitError(err: string){
    this.error.emit(err);
  }
  
  emmitImage(numero: number){
    let img: Image = new Image();
    img.numero = numero;
    img.content = this.image[numero].content;
    img.raw = this.image[numero].raw;
    this.onImage.emit(img);
  }

  public getPhoto(position: number): string{
    return this.image[position].content;
  }

  public getAll(): string[]{
    let retorno: string[] = [];
    for(let img of this.image){
      retorno.push(img.content);
    }
    return retorno;
  }

  // cube code
  slideOpts = {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    on: {
      beforeInit: function() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
  
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };
  
        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(this.originalParams, overwriteParams);
      },
      setTranslate: function() {
        const swiper = this;
        const {
          $el, $wrapperEl, slides, width: swiperWidth, height: swiperHeight, rtlTranslate: rtl, size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }
  
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + (round * 4 * swiperSize);
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = (3 * swiperSize) + (swiperSize * 4 * round);
          }
          if (rtl) {
            tx = -tx;
          }
  
           if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }
  
           const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = (slideIndex * 90) + (progress * 90);
            if (rtl) wrapperRotate = (-slideIndex * 90) - (progress * 90);
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`,
        });
  
         if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(`translate3d(0px, ${(swiperWidth / 2) + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - (Math.floor(Math.abs(wrapperRotate) / 90) * 90);
            const multiplier = 1.5 - (
              (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2)
              + (Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2)
            );
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${(swiperHeight / 2) + offset$$1}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
          }
        }
  
        const zFactor = (swiper.browser.isSafari || swiper.browser.isUiWebView) ? (-swiperSize / 2) : 0;
        $wrapperEl
          .transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
      },
      setTransition: function(duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      },
    }
  }
}
