import { environment } from 'src/environments/environment';

export class Adress{
    public calle: string;
    public cp: number;
    public numExt: string;
    public numInt: string;
    public colonia: number;
    public coloniaS: string;
    public delegacion: number;
    public delegacionS: string;
    public ciudad: number;
    public ciudadS: string;
    public estado: number;
    public estadoS: string;
    public pais: number;
    public paisS: string;
    public comprobante: string;
    public comprobanteRaw: string;

    constructor(){
        this.calle = '';
        this.cp = 0;
        this.numExt = '';
        this.numInt = '';
        this.comprobante = '';
        this.comprobanteRaw = '';
        this.coloniaS = '';
        this.delegacionS = '';
        this.ciudadS = '';
        this.estadoS = '';
        this.paisS = '';
        this.pais = environment.mexico_id;
        this.estado = environment.cdmx_id;
        this.ciudad = 1;
        this.delegacion = 1;
        this.colonia = 1;
    }

    public allParams(): boolean {
        this.calle = this.calle.toUpperCase();
        this.numExt = this.numExt.toUpperCase();
        this.numInt = this.numInt.toUpperCase();
        console.log(JSON.stringify(this));
        console.log((this.calle.length >= 3 ) + ' - ' +  ( this.cp >= 1000 ) + ' - ' +  ( this.delegacion >= 1 ) + ' - ' +  ( this.ciudad >= 1 ) + ' - ' +  ( this.estado >= 1 ) + ' - ' +  ( this.pais >= 1));
        return this.calle.length >= 3 && this.cp >= 1000 && this.delegacion >= 1 && this.ciudad >= 1 && this.estado >= 1 && this.pais >= 1;
    }
}