import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../bid/services/storage.service';
import { Credit } from 'src/app/classes/model/credit';
import { Device } from '@ionic-native/device/ngx';
import { Agreement } from 'src/app/classes/model/agreement';
import { NumbersService } from '../../bid/services/numbers.service';

@Injectable({
    providedIn: 'root'
})

export class ReadDocument {

    public credito: any;
    public agreement: any;
    public data_client: any;
    public email: any;
    public address: any;
    public periodicidad: any;
    public semanal: any;
    public quincenal: any;
    public catorcenal: any;
    public mensual: any;
    public plazo_letra: any;
    public estado: any;
    public ciudad: any;
    public colonia: any;
    public banco: any;
    public agent: any;
    public agent_name: any;
    public claveEjecutivo: any;
    public telefono: any;
    public masculino: any;
    public femenino: any;
    public fechaNac: any;
    public diaNac: any;
    public mesNac: any;
    public anioNac: any;
    public fecha = new Date();
    public dia: any;
    public mes: any;
    public anio: any;
    public fechaLab: any;
    public diaLab: any;
    public mesLab: any;
    public anioLab: any;
    public antiguedad: any;
    public workAddress: any;
    public referencias: any;
    public kyc: any;
    public politicoSi: any;
    public politicoNo: any;
    public ingresosSi: any;
    public ingresosNo: any;
    public autoSi: any;
    public autoNo: any;
    public aceptaSi: any;
    public aceptaNo: any;
    public operationId: any;
    public clabe: any;
    public sex: any;
    public token: any;

    constructor(private http: HttpClient, private storage: StorageService, private numbers: NumbersService, private device: Device) { 
        this.ionViewDidEnter();
    }

    async ionViewDidEnter() {
        this.credito = new Credit();
        this.token = await this.storage.get(environment.token);
        this.credito = await this.storage.get(environment.credit);
        console.log('Credito FInal', this.credito);
        this.agreement = new Agreement();
        this.agreement = await this.storage.get(environment.agreement);
        console.log('Agreement Final', this.agreement);
        this.data_client = await this.storage.get(environment.dataOcr);
        console.log('Client Data Final', this.data_client);
        this.address = await this.storage.get(environment.person_adress);
        console.log('Address Final', this.address);
        this.email = await this.storage.get(environment.email);
        console.log('Email Final', this.email);
        this.telefono = await this.storage.get(environment.telefono);
        console.log('Telefono Final', this.telefono);
        this.agent = await this.storage.get(environment.agente);
        console.log('Agente Final', this.agent);
        this.operationId = await this.storage.get(environment.operation);
        console.log('Operation ID Final', this.operationId);
        this.kyc = await this.storage.get(environment.kyc);
        console.log('KYC Final', this.kyc);
        this.agent_name = this.agent.name + ' ' + this.agent.lastname + ' ' + this.agent.middleName;

        if (this.kyc.exposed === "si") {
            this.politicoNo = '';
            this.politicoSi = 'X';
        } else {
            if (this.kyc.exposed === 'no') {
                this.politicoNo = 'X';
                this.politicoSi = '';
            } else {
                this.politicoNo = '';
                this.politicoSi = '';
            }
        }

        if (this.kyc.adicionales === 'si') {
            this.ingresosNo = '';
            this.ingresosSi = 'X';
        } else {
            if (this.kyc.adicionales === 'no') {
                this.ingresosNo = 'X';
                this.ingresosSi = '';
            } else {
                this.ingresosNo = '';
                this.ingresosSi = '';
            }
        }

        if (this.kyc.auto === 'si') {
            this.autoNo = '';
            this.autoSi = 'X';
        } else {
            if (this.kyc.auto === 'no') {
                this.autoNo = 'X';
                this.autoSi = '';
            } else {
                this.autoNo = '';
                this.autoSi = '';
            }
        }
    }

    generaDoc (code, token) {

        console.log('Codigo Doc', code);
        const docType = "2";
        const firmaAuth = "";
        const firmaBio = "";
        this.aceptaNo = "";
        this.aceptaSi = "";

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        });

        return this.http.post(environment.servicesURL + environment.generateDoc, JSON.stringify(this.generarJsonDocSF(code, docType, firmaAuth, firmaBio)), {headers});

    }

    generaDocFirma (code, token, firmaAuth, firmaBio, operation, userId) {

        console.log('Codigo Doc', code);
        const docType = "2";
        this.aceptaNo = "";
        this.aceptaSi = "X";

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        });

        var pdf = this.http.post(environment.servicesURL + environment.generateDoc, JSON.stringify(this.generarJsonDoc(code, docType, firmaAuth, firmaBio)), {headers});

        this.saveDocuments(pdf, code, operation, userId, token);

        return pdf;

    }

    saveDocuments(pdf, code, operationId, userId, token) {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          });

         return this.http.post(environment.servicesURL + environment.saveDoc, JSON.stringify(this.generateJsonSaveDoc(pdf, code, operationId, userId)), {headers});
    }

    generateJsonSaveDoc(pdf, code, operationId, userId) {
        const jsonF = {
            operationId: operationId,
            metadata: {
              deviceinfo: this.device.platform + ' ' + this.device.version + ' - ' + this.device.model + ' - ' +this.device.manufacturer,
              userId: userId
            },
            data: {
              documents: [
                {
                  documentCode: code,
                  file: pdf
                }
              ]
            }
           
          }
          console.log('Json Imagen', JSON.stringify(jsonF));
          return jsonF;
      
    }

    generarJsonDocSF (code, docType, firmaAuth, firmaBio) {

        const jsonDoc = {
            operationId: this.operationId.operationId,
            data: {
                ducmentType: docType,
                codeContract: "AMIGO",
                campos: [
                    {
                        nombre:"USU",
                        valor: this.data_client.nombre + ' ' + this.data_client.aPaterno + ' ' + this.data_client.aMaterno
                    },
                    {
                        nombre:"CURP",
                        valor: this.data_client.curp
                    },
                    {
                        nombre:"DOM",
                        valor: this.data_client.address
                    },
                    {
                        nombre:"APRI",
                        valor: "X"
                    },
                    {
                        nombre:"CCRE",
                        valor: "X"
                    },
                    {
                        nombre:"RLLA",
                        valor: "X"
                    },
                    {
                        nombre: "FIRM",
                        valor: this.data_client.nombre + ' ' + this.data_client.aPaterno + ' ' + this.data_client.aMaterno
                    }
                ]
            }
        }
    
        console.log('JsonDoc: ', JSON.stringify(jsonDoc));
        return jsonDoc;
    }

    generarJsonDoc (code, docType, firmaAuth, firmaBio) {

        const jsonDoc = {
            operationId: this.operationId.operationId,
            data: {
                ducmentType: docType,
                codeContract: "AMIGO",
                campos: [
                    {
                        nombre:"USU",
                        valor: this.data_client.nombre + ' ' + this.data_client.aPaterno + ' ' + this.data_client.aMaterno
                    },
                    {
                        nombre:"CURP",
                        valor: this.data_client.curp
                    },
                    {
                        nombre:"DOM",
                        valor: this.data_client.address
                    },
                    {
                        nombre:"APRI",
                        valor: "X"
                    },
                    {
                        nombre:"CCRE",
                        valor: "X"
                    },
                    {
                        nombre:"RLLA",
                        valor: "X"
                    },
                    {
                        nombre: "FIRM",
                        valor: this.data_client.nombre + ' ' + this.data_client.aPaterno + ' ' + this.data_client.aMaterno
                    },
                    {
                        nombre: "imgFirma",
                        valor: firmaBio
                    }
                ]
            }
        }
    
        console.log('JsonDoc: ', JSON.stringify(jsonDoc));
        return jsonDoc;
    }

    updatePerson() {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        });

        return this.http.post(environment.servicesURL + environment.updatePerson, JSON.stringify(this.genJsonUpdPerson()), {headers});
    }

    genJsonUpdPerson() {
        const request = {
            operationId: this.operationId,
            metadata: {
                deviceinfo: this.device.platform + ' ' + this.device.version + ' - ' + this.device.model + ' - ' +this.device.manufacturer,
                userId: this.agent.user
            },
            data: {
                person: {
                    sex: this.sex,
                    birthDate: this.anioNac + '-' + this.mesNac + '-' + this.diaNac,
                    email: this.email,
                    phone: {
                        number: this.telefono
                    }
                }
            },
            action: "update-person"
        };
        console.log('Datos Update Person', JSON.stringify(request));
        return request;
    }

}