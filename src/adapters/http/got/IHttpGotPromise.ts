import {IHttpPromise} from '../../../libs/http/IHttpResponse';

// export type IHttpGotPromise<B extends Buffer | string | object> = IHttpPromise<B> | GotPromise<B>;
export interface IHttpGotPromise<B extends Buffer | string | object> extends IHttpPromise<B> {

  cancel(): void;
}
