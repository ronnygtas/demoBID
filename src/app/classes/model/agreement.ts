import { Product } from './product';

export class Agreement{
   id: number;
   name: string;
   code: string;
   discountKey: string;
   monthlyInterestRate: number;
   annualInterestRate: number;
   cat: number;
   minAmount: string;
   maxAmount: string;
   minTerm: string;
   maxTerm: string;
   minLiquid: string;
   version: number;
   retainer: string;
   ownMaxTermMatrix: OwnMaxTermMatrix;
   ownTmppTerm: OwnTmppTerm;
   ownPaymentFrecuency: OwnPaymentFrecuency;
   product: Product;
   active: boolean;
   registerDate: string;
   createdBy: string;
   lastModifiedBy: string;
   lastUpdateDate: string;
   affiliate: string;
}

export class OwnMaxTermMatrix{
    id: number;
}

export class OwnTmppTerm{
    id: number;
}

export class OwnPaymentFrecuency{
    id: number;
}