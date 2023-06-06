import { HttpStatusCode } from "@angular/common/http";

export class ServiceResponse<T>{
    data: T;
    statusCode: HttpStatusCode;
    message: string;
}