export class OcrExtend{
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

    // extended
    public address: string;
    
    public maxDate: string;

    constructor(){
        this.nombre = '';
        this.aPaterno = '';
        this.aMaterno = '';
        this.registro = (new Date()).getFullYear() + '';
        this.emision = (new Date()).getFullYear() + '';
        this.claveElector = '';
        this.curp = '';
        this.rfc = '';
        this.ocr = '';
        this.vCurp = false;
        this.vRFC = false;
    }

    public allData(): boolean{
        if(this.registro){this.registro = this.registro.length > 4 ? this.registro.substring(0, 4): this.registro;}
        if(this.emision){this.emision = this.emision.length > 4 ? this.emision.substring(0, 4): this.emision;}
        return this.nombre.length >= 3 && this.aPaterno.length >= 3 && this.aMaterno.length >= 3 && this.claveElector.length >= 3 && this.validCurp() && this.validRFC() && this.ocr.length >= 3;
    }

    public validCurp(): boolean{
        this.curp = this.curp.toUpperCase();
        this.vCurp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/.test(this.curp);
        return this.vCurp;
    }

    public validRFC(): boolean{
        this.rfc = this.rfc.toUpperCase();
        if(this.rfc.length > 5){
            this.vRFC = this.curp.indexOf(this.rfc.substring(0, this.rfc.length - 3)) >= 0 && this.rfc.length == 13;
            return this.vRFC;
        }else{
            this.vRFC = false;
            return this.vRFC;
        }
    }
}