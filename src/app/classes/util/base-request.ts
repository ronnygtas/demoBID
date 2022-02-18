import { BaseRequestMetadata } from './base-request-metadata';

export class BaseRequest {
    data?: any;
    metadata: BaseRequestMetadata;
    operationId?: number;

    constructor(){
        this.metadata = new BaseRequestMetadata();
    }
}