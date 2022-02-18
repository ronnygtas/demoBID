export class Person{
    public birthDate: string;
    public catPersonTypeId: number;
    public code: string;
    public countryOfBirth: string;
    public data: string;
    public email: string;
    public firstName: string;
    public id: number;
    public language: string;
    public lastName: string;
    public maritalStatus: string;
    public middleName: string;
    public observations: string;
    public sex: string;
    public ssn: string;

    constructor(){
        this.catPersonTypeId= 1;
        this.countryOfBirth= "--";
        this.email= "-";
        this.firstName= "--";
        this.language= "--";
        this.lastName= "--";
        this.middleName= "--";
        this.sex= "--";
        this.ssn= "--";
    }
}