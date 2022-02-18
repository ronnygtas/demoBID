export class CameraDto  {
    public name: string;
    public content: string;
    public raw: string;
    public height: string;
    public width: string;
    public blob: any;

    constructor(name: string){
        this.name = name;
        this.content = null;
        this.height = '';
        this.width = '';
    }
}

export class Image{
    numero: number;
    content: string;
    blob: any;
    raw: string;
}