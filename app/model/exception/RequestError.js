
export class RequestError {

    errors: any;
    message: string;
    errorCode: number;

    constructor( message: string = null, errors: any, errorCode = 0 ) {

        this.message = message;
        this.errors = errors;
        this.errorCode = errorCode;

    }

}