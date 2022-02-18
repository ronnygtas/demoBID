import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Ocr } from '../../classes/model/ocr';
import { Adress } from '../../classes/model/adress';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { OperationsObj } from 'src/app/classes/model/operations-obj';

@Injectable({
  providedIn: 'root'
})
export class UpdatePersonService {

  constructor(private http: HttpClient) { }

  updatePersona(dataPerson: Ocr, token: any, personId: any, operation: OperationsObj) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    console.log(JSON.stringify(this.createJUpdatePersona(dataPerson, personId, operation.operationId)));
    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.createJUpdatePersona(dataPerson, personId, operation.operationId)), {headers});

  }

  createJUpdatePersona(dataPerson: Ocr, personId: any, operation: any) {
    const request = {
        operationId: operation,
        metadata: {
            userId: 1
        },
        data: {
            person: {
                id: personId,
                firstName: dataPerson.nombre,
                middleName: dataPerson.aMaterno,
                lastName: dataPerson.aPaterno,
                catPersonType: {
                    id: 1
                }
            },
          action: 'update-person'
    }
    
    };

    console.log('REQUEST SAVE PERSON   ', JSON.stringify(request));
    return request;
  }

  saveAdressPerson(dataAdress: Adress, token: any, personId: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.createJSaveA(dataAdress, personId)), {headers});

  }

  createJSaveA(dataAdress: Adress, personId: any) {
    const request = {
      metadata: {
          userId: 1
      },
      data: {  
          addresses: [
              {
                  street: dataAdress.calle,
                  intNumber: dataAdress.numInt,
                  colony: dataAdress.colonia,
                  catCity: {
                      id: dataAdress.ciudad
                  },
                  country: {
                      id: dataAdress.pais
                  },
                  zipCode: dataAdress.cp,
                  extNumber: dataAdress.numExt,
                  catTown: {
                      id: dataAdress.delegacion
                  },
                  catState: {
                      id: dataAdress.estado
                  },
                  active: true,
                  person: {
                    id: personId
                  }
              }
          ],
          action: 'save-address'
      }
  };

  // console.log('REQUEST SAVE ADRESS  ', JSON.stringify(request));
  return request;
    
  }

  createPersona(token: any, userId: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.createJCreatePerson(userId)), {headers});

  }

  createJCreatePerson(user: any) {
    const request = {
      metadata: {
          userId: user
      },
      data: {  
          person: {
              firstName: '--',
              middleName: '--',
              lastName: '--',
              sex: '--',
              language: '--',
              ssn: '--',
              countryOfBirth: '--',
              email: '-',
              catPersonType: {
                  id: 1
              },
          },
          action: 'save-person'
      }
  };
  // console.log('REQUEST CREATE PERSON   ', JSON.stringify(request));
  return request;

  }

  createPersonaOperation(token: any, userId: any, operation: number) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.createJCreatePersonOperation(userId, operation)), {headers});

  }

  createJCreatePersonOperation(user: any, operation: number) {
    const request = {
      metadata: {
          userId: user
      },
      data: {  
          person: {
              firstName: '--',
              middleName: '--',
              lastName: '--',
              sex: '--',
              language: '--',
              ssn: '--',
              countryOfBirth: '--',
              email: '-',
              catPersonType: {
                  id: 1
              },
          },
          action: 'save-person'
      },
      operationId: operation
  };
  // console.log('REQUEST CREATE PERSON   ', JSON.stringify(request));
  return request;

  }

  updatePersonaOperation(token: any, userId: any, operation: number, data: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.updateJCreatePersonOperation(userId, operation, data)), {headers});

  }

  updateJCreatePersonOperation(user: any, operation: number, data: any) {
    const request = {
      metadata: {
          userId: user
      },
      data: {  
          person: data,
          action: 'update-person'
      },
      operationId: operation
  };
  // console.log('REQUEST CREATE PERSON   ', JSON.stringify(request));
  return request;

  }

  savePersonPhone(token: any, userId: any, operation: number, person: any, number: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.savePersonPhoneJ(userId, operation, person, number)), {headers});

  }

  savePersonPhoneJ(user: any, operation: number, person: any, number: any) {
    const request = {
      metadata: {
          userId: user
      },
      data: {  
        phones: [
            {
                number: number,
                extension: '',
                type: 1,
                active: true,
                person:{
                  id: person
                }
            }
        ],
        action: "save-phone"
      },
      operationId: operation
  };
  // console.log('REQUEST CREATE PERSON   ', JSON.stringify(request));
  return request;

  }

  savePersonAddress(token: any, userId: any, operation: number, person: any, adress: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.savePersonAddressJ(userId, operation, person, adress)), {headers});

  }

  savePersonAddressJ(user: any, operation: number, person: any, ad: Adress) {
    const request = {
      metadata: {
          userId: user
      },
      data: {  
        addresses: [
          {
              street: ad.calle,
              intNumber: ad.numInt,
              colony: ad.colonia,
              catCity: {
                  id: ad.ciudad
              },
              country: {
                  id: ad.pais
              },
              zipCode: ad.cp,
              extNumber: ad.numExt,
              catTown: {
                  id: ad.delegacion
              },
              catState: {
                  id: ad.estado
              },
              active: true,
              person:{
                  id: person
              }
            }
        ],
        "action": "save-address"
      },
      operationId: operation
  };
  // console.log('REQUEST CREATE PERSON   ', JSON.stringify(request));
  return request;

  }
  
  
}
