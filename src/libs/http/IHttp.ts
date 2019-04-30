import {IHttpGetOptions} from "./IHttpGetOptions";
import {IHttpPromise, IHttpResponse, IHttpStream} from "./IHttpResponse";
import {IHttpPostOptions} from "./IHttpPostOptions";
import {IHttpPutOptions} from "./IHttpPutOptions";
import {IHttpDeleteOptions} from "./IHttpDeleteOptions";
import {IHttpHeadOptions} from "./IHttpHeadOptions";
import {IHttpPatchOptions} from "./IHttpPatchOptions";


export function isStream(pet: IHttpPromise<any> | IHttpStream<any>): pet is IHttpStream<any> {
  return (<IHttpStream<any>>pet).eventNames !== undefined;
}

export interface IHttp {

  readonly name: string;

  isAvailable(): Promise<boolean>;

  get(url: string, options?: IHttpGetOptions): IHttpPromise<any>;

  get(url: string, options?: IHttpGetOptions & { stream: boolean }): IHttpStream<any>;

  patch(url: string, options?: IHttpPatchOptions): IHttpPromise<any>;

  patch(url: string, options?: IHttpPatchOptions & { stream: boolean }): IHttpStream<any>;

  head(url: string, options?: IHttpHeadOptions): IHttpPromise<any>;

  head(url: string, options?: IHttpHeadOptions & { stream: boolean }): IHttpStream<any>;

  post(url: string, options?: IHttpPostOptions): IHttpPromise<any>;

  post(url: string, options?: IHttpPostOptions & { stream: boolean }): IHttpStream<any>;

  put(url: string, options?: IHttpPutOptions): IHttpPromise<any>;

  put(url: string, options?: IHttpPutOptions & { stream: boolean }): IHttpStream<any>;

  delete(url: string, options?: IHttpDeleteOptions): IHttpPromise<any>;

  delete(url: string, options?: IHttpDeleteOptions & { stream: boolean }): IHttpStream<any>;

}
