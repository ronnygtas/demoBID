import { HttpHeaders } from '@angular/common/http';

export class HttpOptions {
    public headers?: HttpHeaders;// | { [header: string]: string | string[]; }; observe?: "body"; params?: HttpParams | { [param: string]: string | string[]; }; reportProgress?: boolean; responseType: "arraybuffer"; withCredentials?: boolean; }
}
