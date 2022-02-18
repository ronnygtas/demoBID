export class Ine {
    public nombre: string;
    public aPaterno: string;
    public aManterno: string;
    public ocr: string;
    public similitud: number;
    public aprove: boolean;

    constructor(){
        this.nombre = '';
        this.aPaterno = '';
        this.aManterno = '';
        this.ocr = '';
        this.similitud = 0;
        this.aprove = true;
    }
}
