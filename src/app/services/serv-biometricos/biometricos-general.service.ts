import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Hands } from '../../bid/components/enrollment/hands';
import { BaseRequest } from 'src/app/classes/util/base-request';

@Injectable({
  providedIn: 'root'
})
export class BiometricosGeneralService {

  constructor(private http: HttpClient) { }

  enrollBiometric(dataF: Hands, token: any, opId: any, systemCode: any, personId: any, userId: any, userType: number) {
    let request : any;
    if(userType === 1) {
      request = this.createJFingersUser(dataF, opId, systemCode, userId);
    } else {
      request = this.createJFingersClient(dataF, opId, systemCode, personId);
    }
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.servicesURL + environment.enrrolFingers, JSON.stringify(request),  {headers});
  }

  createJFingersUser(dataF: Hands, opId: any, systemCode: any, userId: any) {
    let numFingers: number = 0;
    numFingers += dataF.right_middle.active ? 1 : 0;
    numFingers += dataF.right_pinky.content ? 1 : 0;
    numFingers += dataF.right_ring.content ? 1 : 0;
    numFingers += dataF.right_index.content ? 1 : 0;
    numFingers += dataF.left_index.content ? 1 : 0;
    numFingers += dataF.left_middle.content ? 1 : 0;
    numFingers += dataF.left_pinky.content ? 1 : 0;
    numFingers += dataF.left_ring.content ? 1 : 0;
    let request = {
      operationId: opId,
      data: {
      enrollmentCode: systemCode,
      userId: userId,
      userType: 1,
      numOfFingers: numFingers
      },
      metadata: {
        accuracy: 0,
        deviceInfo: '',
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: 1
      }
    };
    if(dataF.right_middle.content){request['data']['rightmiddle'] = dataF.right_middle.content;}
    if(dataF.right_pinky.content){request['data']['rightlittle'] = dataF.right_pinky.content;}
    if(dataF.right_ring.content){request['data']['rightring'] = dataF.right_ring.content;}
    if(dataF.right_index.content){request['data']['rightindex'] = dataF.right_index.content;}
    if(dataF.left_index.content){request['data']['leftindex'] = dataF.left_index.content;}
    if(dataF.left_middle.content){request['data']['leftmiddle'] = dataF.left_middle.content;}
    if(dataF.left_pinky.content){request['data']['leftlittle'] = dataF.left_pinky.content;}
    if(dataF.left_ring.content){request['data']['leftring'] = dataF.left_ring.content;}
    console.log('REQUEST FINGERS  ', JSON.stringify(request));
    return request;

  }

  createJFingersClient(dataF: Hands, opId: any, systemCode: any, personId: any) {
    let numFingers: number = 0;
    numFingers += dataF.right_middle.active ? 1 : 0;
    numFingers += dataF.right_pinky.content ? 1 : 0;
    numFingers += dataF.right_ring.content ? 1 : 0;
    numFingers += dataF.right_index.content ? 1 : 0;
    numFingers += dataF.left_index.content ? 1 : 0;
    numFingers += dataF.left_middle.content ? 1 : 0;
    numFingers += dataF.left_pinky.content ? 1 : 0;
    numFingers += dataF.left_ring.content ? 1 : 0;
    let request = {
      operationId: opId,
      data: {
      enrollmentCode: systemCode,
      personID: personId,
      userType: 2,
      numOfFingers: numFingers
      },
      metadata: {
        accuracy: 0,
        deviceInfo: '',
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: 1
      }
    };
    if(dataF.right_middle.content){request['data']['rightmiddle'] = dataF.right_middle.content;}
    if(dataF.right_pinky.content){request['data']['rightlittle'] = dataF.right_pinky.content;}
    if(dataF.right_ring.content){request['data']['rightring'] = dataF.right_ring.content;}
    if(dataF.right_index.content){request['data']['rightindex'] = dataF.right_index.content;}
    if(dataF.left_index.content){request['data']['leftindex'] = dataF.left_index.content;}
    if(dataF.left_middle.content){request['data']['leftmiddle'] = dataF.left_middle.content;}
    if(dataF.left_pinky.content){request['data']['leftlittle'] = dataF.left_pinky.content;}
    if(dataF.left_ring.content){request['data']['leftring'] = dataF.left_ring.content;}
    console.log('REQUEST FINGERS  ', JSON.stringify(request));
    return request;
  }

  identifyEnrrol(finger: Hands, token: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.identifyEnroll, JSON.stringify(this.createJIdentifyE(finger)),  {headers});

  }

  createJIdentifyE(finger: Hands) {
    const request = {
      data: {
        leftindex: finger.left_index.content,
        leftmiddle: finger.left_middle.content,
        leftring: finger.left_ring.content,
        leftlittle: finger.left_pinky.content,
        rightindex: finger.right_index.content,
        rightmiddle:  finger.right_middle.content,
        rightring:  finger.right_ring.content,
        rightlittle:  finger.right_pinky.content,
        userType: 2
      },
      metadata: {
        accuracy: 0,
        deviceInfo: "Android",
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: 1
      }
    };

    console.log('REQUEST IDENTIFY   ', JSON.stringify(request));
    return request;
  }

  faceEnroll(face: string, token: any, code: string, operation: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.servicesURL + environment.face_serv, JSON.stringify(this.faceEnrollJ(face, code, operation)),  {headers});
  }

  faceEnrollJ(face: string, code: string, operation: number) {
    let base: BaseRequest = new BaseRequest();
    base.metadata.userId = 1;
    base.operationId = operation;
    const data = {
      userType: 2,
      enrollmentCode: code,
      b64Selfie: face
    };
    base.data = data;
    return data;
  }

  compareFace(face: string, id: string, operation: number, token: string){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.servicesURL + environment.face_compare, JSON.stringify(this.compareFaceJ(id, face, operation)),  {headers});
  }

  compareFaceJ(id: string, face: string, operation: number){
    let base: BaseRequest = new BaseRequest();
    base.metadata.userId = 1;
    base.operationId = operation;
    const data = {
      operationId: operation,
      data: {
        credencial: id,
        captura: face,
        tipo: 'imagen',
        limiteInferior: 80,
        idCompania: 1
      }
    }
    base.data = data;
    return data;
  }

  veriSign(data, token, operationId, userId) {
    console.log('finger data sign', data);
    const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'content-type': 'application/json'
      });
      return this.http.post(environment.servicesURL + environment.fingerVerify, JSON.stringify(this.genJsonFingers(data, operationId, userId)), {headers});
  }
  genJsonFingers(data, operationId, userId) {
      const request = {
          operationId: operationId,
          data: {
            leftindex: data['left_index']['content'],
            leftmiddle: data['left_middle']['content'],
            leftring: data['left_ring']['content'],
            leftlittle: data['left_pinky']['content'],
            rightindex: data['right_index']['content'],
            rightmiddle: data['right_middle']['content'],
            rightring: data['right_ring']['content'],
            rightlittle: data['right_pinky']['content']
          },
          metadata: {
            accuracy: 0,
            deviceInfo: "Android",
            latutide: 0,
            longitude: 0,
            timeZoneId: 1,
            userId: userId
          }
        };
        console.log('data before json', data);
        console.log('JSON Fingers', JSON.stringify(request));
        return request;
  }

}
