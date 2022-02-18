export class Adress{
    public calle: string;
    public cp: number;
    public numExt: string;
    public numInt: string;
    public colonia: number;
    public delegacion: number;
    public ciudad: number;
    public estado: number;
    public pais: number;
    public comprobante: string;
    public comprobanteRaw: string;

    constructor(){
        this.calle = '';
        this.cp = 0;
        this.numExt = '';
        this.numInt = '';
        this.comprobante = '';
        this.comprobanteRaw = '';
    }

    public allParams(): boolean {
        this.calle = this.calle.toUpperCase();
        this.numExt = this.numExt.toUpperCase();
        this.numInt = this.numInt.toUpperCase();
        return this.calle.length >= 3 && this.cp >= 10000 && this.delegacion >= 1 && this.ciudad >= 1 && this.estado >= 1 && this.pais >= 1;
    }
}