PARA INSTALAR:

cordova plugin add FacialBidMitek


PARA DES_INSTALAR:

cordova plugin rm com.miteksystems.FacialBidMitek


CODIGO HTML

 <button (click)="startFacial()">
    ---------- startFacial  --------
  </button>
  {{idFront}}


CODIGO TS

despues de los import:

declare var FacialBidMitek: any;


Metodo:

startFacial() {
    FacialBidMitek.coolMethod('{}', (success) =>  {
      alert('success al utilizar el componente' + success);
    } , (error) => {
      alert('Error al utilizar el componente');
    });
    /*setInterval(() => {
      return this.idFront;
   }, 0);*/
}

