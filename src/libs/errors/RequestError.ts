export class RequestError extends Error {

  constructor(message:string){
    super(message);

    Object.setPrototypeOf(this,RequestError.prototype);
  }

}
