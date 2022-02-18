import { Agreement } from './agreement';

export class Appointment{
    id: 19;
    name: "BASE";
    minAmount: 3000;
    maxAmount: 30000;
    termMin: 20;
    termMax: 30000;
    payCapacity: 1;
    liquidMin: 750;
    ownAgreement: Agreement;
    active: true;
    registerDate: string;
    createdBy: string;
    lastModifiedBy: string;
    lastUpdateDate: string
}