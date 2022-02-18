import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Ocr } from '../../classes/model/ocr';

@Injectable({
  providedIn: 'root'
})
export class ConsultaIneService {

  constructor(private http: HttpClient) { }

  queryIne(fingers: any, dataPerson: Ocr, token: any, opId: any, systemCode: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.queryIne, JSON.stringify(this.createJIne(fingers, dataPerson, opId, systemCode)), {headers});
    
  }

  createJIne(fingers: any, dataPerson: Ocr, opId: any, systemCode: any) {
    const request = {
      operationId: opId,
      metadata: {
          userId: 1
      },
      data: {
        appeal: {},
        request: {
          cliente: 'FINBE',
          ejecutivo: 'prueba',
          ocr: dataPerson.ocr,
          cic: '',
          nombre: dataPerson.nombre,
          apellidoPaterno: dataPerson.aPaterno,
          apellidoMaterno: dataPerson.aMaterno,
          anioRegistro: dataPerson.registro,
          anioEmision: dataPerson.emision,
          numeroEmisionCredencial: '01',
          claveElector: dataPerson.claveElector,
          curp: dataPerson.curp,
          minucia2: fingers.get('rightIndex').split('\n').join().split('\r').join(),
          minucia7: fingers.get('leftIndex').split('\n').join().split('\r').join()
        }
      }
    };
    
    console.log('REQUEST INE ',  JSON.stringify(request));
    return request;
  }
}
