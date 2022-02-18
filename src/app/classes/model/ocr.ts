import { stringify } from '@angular/compiler/src/util';

export class Ocr {
    public nombre: string;
    public aPaterno: string;
    public aMaterno: string;
    public registro: string;
    public emision: string;
    public claveElector: string;
    public curp: string;
    public vCurp: boolean;
    public rfc: string;
    public vRFC: boolean;
    public ocr: string;
    public vigencia: string;
    public nacimiento: string;
    public message: string;
    
    public maxDate: string;

    public address: string;

    public tipoID: string;

    constructor(){
        this.nombre = '';
        this.aPaterno = '';
        this.aMaterno = '';
        this.registro = '';
        this.emision = '';
        this.claveElector = '';
        this.curp = '';
        this.rfc = '';
        this.ocr = '';
        this.vCurp = false;
        this.vRFC = false;
        this.tipoID = '';
    }

    public allData(): boolean{
        if(this.registro){
            let date = new Date();
            date.setFullYear(this.registro.length > 4 ? +this.registro.substring(0, 4): +this.registro);
            this.registro = date.getFullYear().toString();
            console.log('REGISTRO: ', this.registro);
        }
        if(this.emision){
            let date = new Date();
            date.setFullYear(this.emision.length > 4 ? +this.emision.substring(0, 4): +this.emision);
            this.emision = date.getFullYear().toString();
            console.log('EMISION: ', this.emision);
        }
        if(this.nacimiento){
            let date = new Date();
            date.setFullYear(this.nacimiento.length > 4 ? +this.nacimiento.substring(0, 4): +this.nacimiento);
            this.nacimiento = date.getFullYear().toString();
            console.log('NACIMIENTO: ', this.nacimiento);
        }
        if(this.vigencia){
            let date = new Date();
            date.setFullYear(this.vigencia.length > 4 ? +this.vigencia.substring(0, 4): +this.vigencia);
            this.vigencia = date.getFullYear().toString();
            console.log('VIGENCIA: ', this.vigencia);
        }
        console.log(JSON.stringify(this));
        console.log((this.nombre.length >= 3 ) + ' - ' +  ( this.aPaterno.length >= 3 ) + ' - ' +  ( this.aMaterno.length >= 3 ) +  ' - ' +  ( this.validCurp() ) + ' - ' +  ( this.validRFC() ) + ' - ' +  ( this.ocr.length >= 3));
        return this.nombre.length >= 3 && this.aPaterno.length >= 3 && this.aMaterno.length >= 3 && this.validCurp() && this.validRFC() && this.ocr.length >= 3;
    }

    public validCurp(): boolean{
        this.curp = this.curp.toUpperCase();
        this.vCurp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(this.curp);
        return this.vCurp;
    }

    public validRFC(): boolean{
        this.rfc = this.rfc.toUpperCase();
        if(this.rfc.length > 5){
            this.vRFC = this.curp.indexOf(this.rfc.substring(0, this.rfc.length - 3)) >= 0 && this.rfc.length >= 10 && this.rfc.length <=13;
            return this.vRFC;
        }else{
            this.vRFC = false;
            return this.vRFC;
        }
    }
}
