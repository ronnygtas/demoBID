export class Ine {
    public nombre: string;
    public aPaterno: string;
    public aManterno: string;
    public ocr: string;
    public similitud: number;
    public similitudFace: number;

    public showINE: boolean;
    public aprove: boolean;
    public showFace: boolean;
    public face: boolean;
    public showRenapo: boolean;
    public renapo: boolean;

    constructor(){
        this.nombre = '';
        this.aPaterno = '';
        this.aManterno = '';
        this.ocr = '';
        this.similitud = 0;
        this.aprove = false;
        this.face = false;
        this.renapo = false;
        this.showINE = true;
        this.showFace = true;
        this.showRenapo = true;
    }
}
