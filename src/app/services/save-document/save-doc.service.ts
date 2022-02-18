import { Injectable, OnInit } from '@angular/core';
import { DocumentObj } from '../../classes/model/document-obj';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseRequest } from '../../classes/util/base-request';
import { ServicesExService } from '../../bid/services/services-ex.service';
import { BaseRequestMetadata } from 'src/app/classes/util/base-request-metadata';
import { GeopositionService } from '../../bid/services/geoposition.service';

@Injectable({
  providedIn: 'root'
})
export class SaveDocService implements OnInit {

  dataDoc: DocumentObj = new DocumentObj();
  localISOTime: any;
  tzoffset: any;
  arrayFecha: any[];
  fecha: string;

  constructor(private http: HttpClient, 
    private ext: ServicesExService,
    private geo: GeopositionService) { }
  
  ngOnInit(): void {
    this.geo.getPosition();
  }

  saveDocument(docFile: any, nameDoc: string, opID: any, token: any) {
    console.log(docFile);

    this.tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    this.localISOTime = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
    this.arrayFecha = this.localISOTime.split('.');
    this.fecha = this.arrayFecha[0] + 'Z';

    this.dataDoc.setDocCode1('IDOFA');
    this.dataDoc.setOperID1(opID);
    this.dataDoc.setActivityStatus1('OK');
    this.dataDoc.setLat(0);
    this.dataDoc.setLng(0);


    const formData = new FormData();
    formData.append('jsonRequest', JSON.stringify(this.dataDoc));
    formData.append('file1', docFile);
    formData.append('dataFile1', JSON.stringify(this.generateJson(nameDoc, this.fecha)));

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });

    return this.http.post(environment.servicesURL + environment.saveDoc, formData, {headers});

  }

  saveDocumentResp(docBase: string, catId: number, opOd: number, token: string){
    let data: any = {};
    data.documents = [];
    data.documents.push({catId: catId,b64docImage: docBase});
    let base: BaseRequest = new BaseRequest();
    base.data = data;
    base.operationId = opOd;
    base.metadata = new BaseRequestMetadata();
    base.metadata.accuracy = this.geo.accuracy;
    base.metadata.latutide = this.geo.latitud;
    base.metadata.longitude = this.geo.longitud;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    console.log(JSON.stringify(base));
    return this.ext.post(environment.servicesURL + environment.save_doc_resp, base, headers);
  }

  generateJson( name: string, fecha: string) {

    const jsonF = {
    'docType': 'bid:Anverso',
    'bid:Nombre': name,
    'bid:PrimerApellido': name,
    'bid:SegundoApellido': name,
    'bid:IDENTIFICACION': '123549',
    'bid:Fecha': fecha,
    'bid:TipoID': 'INE',
    'bid:ScanId': '123123'};

    return jsonF;

  }
}
