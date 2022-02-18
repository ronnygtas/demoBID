import { ValidatorService } from '../../../bid/services/validator.service';

export class UserFingersVerify {
    public newClient: boolean;
    public email: string;
    public emailValid: boolean;
    public numero: number;
    public numeroValid: boolean;

    private validator: ValidatorService;

    constructor(){
        this.validator = new ValidatorService();
        this.newClient = true;
        this.email = '';
        this.numero = 55;
        this.emailValid = false;
        this.numeroValid = false;
    }

    public emailChange(){
        this.emailValid = this.validator.email(this.email);
    }

    public numeroChange(){
        if(this.numero >= 10000000000){
            this.numero = (this.numero - (this.numero % 10)) / 10;
        }
        this.numeroValid = this.validator.validateRange(this.numero, 1000000000, 10000000000);
    }

    public validAllParams(): boolean{
        return this.emailValid && this.numeroValid;
    }
}
