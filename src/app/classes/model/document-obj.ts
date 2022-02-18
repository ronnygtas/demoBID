export class DocumentObj {

    private docCode1: string;
    private operID1: string;
    private activityStatus1: string;
    private lat: any;
    private lng: any;

    constructor() { }

    public getDocCode1() {
        return this.docCode1;
    }
    public setDocCode1(value) {
        this.docCode1 = value;
    }
    public getOperID1(): string {
        return this.operID1;
    }
    public setOperID1(value: string) {
        this.operID1 = value;
    }
    public getActivityStatus1() {
        return this.activityStatus1;
    }
    public setActivityStatus1(value) {
        this.activityStatus1 = value;
    }
    public getLat(): any {
        return this.lat;
    }
    public setLat(lat: any): void {
        this.lat = lat;
    }
    public getLng(): any {
        return this.lng;
    }
    public setLng(lng: any): void {
        this.lng = lng;
    }
}