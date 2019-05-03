import * as _ from "lodash";

import {URL} from "url";
import {ILoggerApi} from "commons-base";
import {IHttp} from "../../../libs/http/IHttp";
import {IHttpGetOptions} from "../../../libs/http/IHttpGetOptions";
import {IHttpDeleteOptions} from "../../../libs/http/IHttpDeleteOptions";
import {IHttpPostOptions} from "../../../libs/http/IHttpPostOptions";
import {IHttpPutOptions} from "../../../libs/http/IHttpPutOptions";
import {IHttpHeadOptions} from "../../../libs/http/IHttpHeadOptions";
import {IHttpPatchOptions} from "../../../libs/http/IHttpPatchOptions";
import {IHttpGotPromise} from "./IHttpGotPromise";
import {IHttpStream} from "../../../libs/http/IHttpResponse";
import {IHttpOptions} from "../../../libs/http/IHttpOptions";

import {httpOverHttp, httpOverHttps, httpsOverHttp, httpsOverHttps} from "./../../../libs/tunnel/Tunnel";
import {RequestError} from "../../../libs/errors/RequestError";
import {TimeoutError} from "../../../libs/errors/TimeoutError";


export class HttpGotAdapter implements IHttp {

  readonly name: string = 'got';

  static GOT: any;

  async isAvailable(logger?: ILoggerApi) {
    try {
      HttpGotAdapter.GOT = await import("got");
      return true;
    } catch (e) {
      if (logger) {
        logger.warn('http got adapter: required got package is not installed. Adapter will not be used.')
      }
      return false;
    }
  }


  private static wrap(url: string, method: string, options: IHttpOptions) {
    const GOT = this.GOT;
    /*
        if (_.has(options, 'responseType')) {
          if (options.responseType == 'json') {
            options.json = true;
          } else if (options.responseType == 'buffer') {
            (<any>options).stream = true;
          }
        }
    */
    if (_.has(options, 'passBody')) {
      (<any>options).resolveBodyOnly = _.get(options, 'passBody', false);
    }

    if (_.has(options, 'proxy') && options.proxy) {
      let proxyUrl = new URL(options.proxy);
      let targetUrl = new URL(url);

      let proxyProtocol = proxyUrl.protocol.replace(':', '').toLowerCase();
      let targetProtocol = targetUrl.protocol.replace(':', '').toLowerCase();


      if (proxyProtocol == 'http' && targetProtocol == 'http') {
        options.agent = httpOverHttp({
          proxy: {
            host: proxyUrl.hostname,
            port: parseInt(proxyUrl.port),
            headers: {}
          }
        });
      } else if (proxyProtocol == 'http' && targetProtocol == 'https') {
        options.agent = httpsOverHttp({
          proxy: {
            host: proxyUrl.hostname,
            port: parseInt(proxyUrl.port),
            headers: {}
          }
        });
      } else if (proxyProtocol == 'https' && targetProtocol == 'http') {
        options.agent = httpOverHttps({
          proxy: {
            host: proxyUrl.hostname,
            port: parseInt(proxyUrl.port),
            headers: {}
          }
        });
      } else if (proxyProtocol == 'https' && targetProtocol == 'https') {
        options.agent = httpsOverHttps({
          proxy: {
            host: proxyUrl.hostname,
            port: parseInt(proxyUrl.port),
            headers: {}
          }
        });
      }
    }

    if (_.has(options, 'stream') && _.get(options, 'stream', false)) {
      let stream = <any>GOT(url, options);
      stream.asPromise = (): IHttpGotPromise<any> => {
        return <IHttpGotPromise<any>>new Promise<any>((resolve, reject) => {
          stream.once('end', resolve);
          stream.once('error', reject);
        });
      };
      return stream;
    }


    let p = null;
    if (options) {
      p = GOT[method](url, options)
    } else {
      p = GOT[method](url)
    }

    if (_.get(options, 'passBody', false)) {
      p = p.then((res:any) => {
        return res.body;
      })
    }

    return p.catch((err: Error) => {
      if (err.name == 'RequestError') {
        const e = new RequestError(err.message);
        _.assign(e, err);
        throw e;
      } else if (err.name == 'TimeoutError') {
        const e = new TimeoutError(err.message);
        _.assign(e, err);
        throw e;
      }
      throw err;
    })
  }


  get(url: string, options?: IHttpGetOptions): IHttpGotPromise<any>;
  get(url: string, options?: IHttpGetOptions & { stream: boolean }): IHttpStream<any>;
  get(url: string, options?: IHttpGetOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    return HttpGotAdapter.wrap(url, 'get', options);
  }


  post(url: string, options?: IHttpPostOptions): IHttpGotPromise<any>;
  post(url: string, options?: IHttpPostOptions & { stream: boolean }): IHttpStream<any>;
  post(url: string, options?: IHttpPostOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    /*
    if(_.has(options,'body')){
      if(!_.isString(options.body) && !_.isBuffer(options.body)){
        if(_.get(options,'json',false)){
          options.body = JSON.stringify(options.body);
        }

      }
    }*/
    return HttpGotAdapter.wrap(url, 'post', options);
  }


  put(url: string, options?: IHttpPutOptions): IHttpGotPromise<any>  ;
  put(url: string, options?: IHttpPutOptions & { stream: boolean }): IHttpStream<any>;
  put(url: string, options?: IHttpPutOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    return HttpGotAdapter.wrap(url, 'put', options);
  }


  delete(url: string, options?: IHttpDeleteOptions): IHttpGotPromise<any> ;
  delete(url: string, options?: IHttpDeleteOptions & { stream: boolean }): IHttpStream<any>;
  delete(url: string, options?: IHttpDeleteOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    return HttpGotAdapter.wrap(url, 'delete', options);
  }


  head(url: string, options?: IHttpHeadOptions): IHttpGotPromise<any> ;
  head(url: string, options?: IHttpHeadOptions & { stream: boolean }): IHttpStream<any>;
  head(url: string, options?: IHttpHeadOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    return HttpGotAdapter.wrap(url, 'head', options);
  }


  patch(url: string, options?: IHttpPatchOptions): IHttpGotPromise<any> ;
  patch(url: string, options?: IHttpPatchOptions & { stream: boolean }): IHttpStream<any> ;
  patch(url: string, options?: IHttpPatchOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    return HttpGotAdapter.wrap(url, 'patch', options);
  }

}
