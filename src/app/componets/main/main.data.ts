import { Hands } from 'src/app/bid/components/enrollment/hands';

export class MainData{
    public usuario: string;
    public contrasena: string;
    public fingers: Hands;

    constructor(){
        this.usuario = '';
        this.contrasena = '';
        this.fingers = new Hands();
    }
}