import {IHttpGetOptions} from './IHttpGetOptions';
import {IHttpPromise, IHttpStream} from './IHttpResponse';
import {IHttpPostOptions} from './IHttpPostOptions';
import {IHttpPutOptions} from './IHttpPutOptions';
import {IHttpDeleteOptions} from './IHttpDeleteOptions';
import {IHttpHeadOptions} from './IHttpHeadOptions';
import {IHttpPatchOptions} from './IHttpPatchOptions';
import {IHttpStreamOptions} from './IHttpStreamOptions';


export function isStream(pet: IHttpPromise<any> | IHttpStream<any>): pet is IHttpStream<any> {
  return (<IHttpStream<any>>pet).eventNames !== undefined;
}

export interface IHttp {

  readonly name: string;

  isAvailable(): boolean;

  get(url: string, options?: IHttpGetOptions): IHttpPromise<any>;

  get(url: string, options?: IHttpGetOptions & IHttpStreamOptions): IHttpStream<any>;

  patch(url: string, options?: IHttpPatchOptions): IHttpPromise<any>;

  patch(url: string, options?: IHttpPatchOptions & IHttpStreamOptions): IHttpStream<any>;

  head(url: string, options?: IHttpHeadOptions): IHttpPromise<any>;

  head(url: string, options?: IHttpHeadOptions & IHttpStreamOptions): IHttpStream<any>;

  post(url: string, options?: IHttpPostOptions): IHttpPromise<any>;

  post(url: string, options?: IHttpPostOptions & IHttpStreamOptions): IHttpStream<any>;

  put(url: string, options?: IHttpPutOptions): IHttpPromise<any>;

  put(url: string, options?: IHttpPutOptions & IHttpStreamOptions): IHttpStream<any>;

  delete(url: string, options?: IHttpDeleteOptions): IHttpPromise<any>;

  delete(url: string, options?: IHttpDeleteOptions & IHttpStreamOptions): IHttpStream<any>;

}
