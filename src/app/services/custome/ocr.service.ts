import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Ocr } from '../../classes/model/ocr';
import { Adress } from '../../classes/model/adress';
import { OcrExtend } from 'src/app/classes/model/ocr-extend';

@Injectable({
  providedIn: 'root'
})
export class OcrService {

  public resulDto: Ocr = new Ocr();
  public resulCD: Adress = new Adress();
  public finishCD: boolean = false;
  public finish: boolean = false;
  public crash: boolean = false;

  constructor(private http: HttpClient) {}

  ine_Ocr(front: any, back: any, token: any, opId: any) {

    const formData = new FormData();
    formData.append('json', '{}');
    formData.append('personID', '0');
    formData.append('docCode1', 'IDOFA');
    formData.append('file1', front);
    formData.append('docCode2', 'IDOFB');
    formData.append('file2', back);
    formData.append('content', 'image/jpeg');
    formData.append('operationID', opId);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.post(environment.servicesURL + environment.ocr, formData, {headers} )
      .subscribe( data => {
        console.log(data);
        this.resulDto.nombre = data['analisys']['name'];
        this.resulDto.aPaterno = data['analisys']['firstSurname'];
        this.resulDto.aMaterno = data['analisys']['secondSurname'];
        this.resulDto.registro = data['analisys']['registry_YEAR'];
        this.resulDto.emision = data['analisys']['expedition_DATE'];
        this.resulDto.claveElector = data['analisys']['claveElector'];
        this.resulDto.curp = data['analisys']['curp'];
        this.resulDto.address = data['analisys']['address'];

        if(data['analisys']['curp']) {
          this.resulDto.rfc = data['analisys']['curp'].substring(0,10);
        }
        
        this.resulDto.ocr = data['analisys']['crc_SECTION'];
        this.resulDto.vigencia = data['analisys']['dateOfExpiry'];
        this.resulDto.nacimiento = data['analisys']['dateOfBirth'];
        this.resulDto.message = data['analisys']['message'];
        console.log('INE-OCR', this.resulDto);
        this.crash = false;
        this.finish = true;
      }, error => {
        console.log(error);
        this.crash = true;
        this.finish = true;
      });
  }
  
  pass_Ocr(front: any, token: any, opId: any) {

    const formData = new FormData();
    formData.append('json', '{}');
    formData.append('personID', '0');
    formData.append('docCode1', 'IDOFA');
    formData.append('file1', front);
    formData.append('content', 'image/jpeg');
    formData.append('operationID', opId);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.post(environment.servicesURL + environment.ocr, formData, {headers} )
      .subscribe( data => {
        console.log(data);
        this.resulDto.nombre = data['analisys']['name'];
        this.resulDto.aPaterno = data['analisys']['firstSurname'];
        this.resulDto.aMaterno = data['analisys']['secondSurname'];
        this.resulDto.registro = data['analisys']['registry_YEAR'];
        this.resulDto.emision = data['analisys']['expedition_DATE'];
        this.resulDto.claveElector = data['analisys']['claveElector'];
        this.resulDto.curp = data['analisys']['curp'];
        this.resulDto.address = data['analisys']['address'];

        if(data['analisys']['curp']) {
          this.resulDto.rfc = data['analisys']['curp'].substring(0,10);
        }
        
        this.resulDto.ocr = data['analisys']['crc_SECTION'];
        this.resulDto.vigencia = data['analisys']['dateOfExpiry'];
        this.resulDto.nacimiento = data['analisys']['dateOfBirth'];
        this.resulDto.message = data['analisys']['message'];
        console.log('INE-OCR', this.resulDto);
        this.crash = false;
        this.finish = true;
      }, error => {
        console.log(error);
        this.crash = true;
        this.finish = true;
      });
  }

  comprobanteDomicilioOcr(document: any, token: any, opId: any) {

    const formDomi = new FormData();
    formDomi.append('fileb64', document[0]);
    formDomi.append('file', document[1]);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    formDomi.append('json', '{"operationID":"' + opId + '"}');

    console.log(JSON.stringify(formDomi));

    return this.http.post(environment.servicesURL + environment.ocr_cd, formDomi, {headers})
      .subscribe( data => {
        if(data['resultOK']){
          console.log(JSON.stringify(data));
          let direccion: string = (data['calle']?data['calle'] + ' ':'') + (data['colonia']?data['colonia'] + ' ': '') + (data['ciudad']?data['ciudad'] + ' ':'') + ', Mexico';
          this.http.post(environment.direction_serv, {direccion: direccion}, {}).subscribe( (dats)=>{
            console.log('GOOGLE: ' + JSON.stringify(dats));
            if(dats['status'] === 'OK'){
              this.resulCD.numExt = dats['numero'];
              this.resulCD.calle = data['calle'] ? data['calle'] : dats['calle'];
              this.resulCD.coloniaS = dats['colonia'].length > 0 ? dats['colonia'] : data['colonia'];
              this.resulCD.ciudadS = dats['colonia'].length > 0 ? dats['colonia'] : data['ciudad'];
              this.resulCD.estadoS = dats['estado'].length > 0 ? dats['estado'] : data['ciudad'];
              this.resulCD.paisS = dats['pais'].length > 0 ? dats['pais'] : 'Mexico';
              this.resulCD.cp = dats['cp'];
              this.finishCD = true;
            }else{
              this.resulCD.calle = data['calle'];
              this.resulCD.ciudadS = data['ciudad'];
              this.resulCD.coloniaS = data['colonia'];
              this.resulCD.paisS = 'MEXICO';
              this.finishCD = true;
            }
          }, error => {
            this.resulCD.calle = data['calle'];
            this.resulCD.ciudadS = data['ciudad'];
            this.resulCD.coloniaS = data['colonia'];
            this.resulCD.paisS = 'MEXICO';
            this.finishCD = true;
          });
        }else{
          console.log('OCR CD EROOR', data);
          this.finishCD = true;
        }
      }, error => {
        console.log(error);
        this.finishCD = true;
      });

  }

  curpRenapo(curp: string, operation: number, token: string){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.servicesURL + environment.curp_validate, JSON.stringify(this.curpRenapoJ(curp, operation)), { headers });
    
  }

  curpRenapoJ(curp: string, operation: number) {
    const request = {
      data: {
        curp: curp,
        responseDocument: '0'
      },
      metadata: {
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: 1
      },
      operationId: operation,
    };
    console.log('REQUES CURP RENAPO', JSON.stringify(request));
    return request;
  }

  public completeAdress(direccion: string){
    this.http.post(environment.direction_serv, {direccion: direccion}, {}).subscribe( (dats)=>{
      console.log('GOOGLE: ' + JSON.stringify(dats));
      if(dats['status'] === 'OK'){
        this.resulCD.numExt = dats['numero'];
        this.resulCD.calle = dats['calle'];
        this.resulCD.coloniaS = dats['colonia'];
        this.resulCD.ciudadS = dats['colonia'];
        this.resulCD.estadoS = dats['estado'];
        this.resulCD.paisS = dats['pais'];
        this.resulCD.cp = dats['cp'];
        this.finishCD = true;
      }else{
        this.resulCD.paisS = 'MEXICO';
        this.finishCD = true;
      }
    }, error => {
      this.resulCD.paisS = 'MEXICO';
      this.finishCD = true;
    });
  }

}
