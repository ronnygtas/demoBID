import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  lowercase(data: string){
    return data.toLowerCase();
  }

  digits(data: string){
    return data;
  }

  abc(data:string){
    let final = '';
    for(let i = 0; i < data.length; i++){
      let char = data.charCodeAt(i);
      if(97 <= char && char <= 122){
        final += String.fromCharCode(char);
      }
    }
    return final;
  }

  public email(email: string): boolean{
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  public validateRange(numero: number, inicio: number, fin: number): boolean{
    return inicio <= numero && numero <= fin;
  }
}
