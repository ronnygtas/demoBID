import { Hands } from '../../../bid/components/enrollment/hands';

export class Enroll{
    public leftData: boolean;
    public rightData: boolean;
    public data: Hands;
    public enrollLeft: boolean;
    public enrollRight: boolean;

    constructor(){
        this.enrollLeft = false;
        this.enrollRight = false;
        this.data = new Hands();
        this.enrollLeft = false;
        this.enrollRight = false;
    }
}