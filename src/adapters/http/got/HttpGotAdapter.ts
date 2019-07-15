import * as _ from 'lodash';

import {URL} from 'url';
import {ILoggerApi} from 'commons-base';
import {IHttp} from '../../../libs/http/IHttp';
import {IHttpGetOptions} from '../../../libs/http/IHttpGetOptions';
import {IHttpDeleteOptions} from '../../../libs/http/IHttpDeleteOptions';
import {IHttpPostOptions} from '../../../libs/http/IHttpPostOptions';
import {IHttpPutOptions} from '../../../libs/http/IHttpPutOptions';
import {IHttpHeadOptions} from '../../../libs/http/IHttpHeadOptions';
import {IHttpPatchOptions} from '../../../libs/http/IHttpPatchOptions';
import {IHttpGotPromise} from './IHttpGotPromise';
import {IHttpStream} from '../../../libs/http/IHttpResponse';
import {IHttpOptions} from '../../../libs/http/IHttpOptions';
import {RequestError} from '../../../libs/errors/RequestError';
import {TimeoutError} from '../../../libs/errors/TimeoutError';
import * as http from 'http';
import {ClassType} from '../../../libs/Constants';


export class HttpGotAdapter implements IHttp {

  static GOT: any;

  static ProxyAgent: ClassType<any>;

  readonly name: string = 'got';


  private static wrap(url: string, method: string, options: IHttpOptions) {
    const GOT = this.GOT;

    if (_.has(options, 'passBody')) {
      (<any>options).resolveBodyOnly = _.get(options, 'passBody', false);
    }

    if (_.has(options, 'proxy') && options.proxy) {
      const proxyHeaders = options.proxyHeaders || {};
      const proxyUrl = new URL(options.proxy);

      const hostName = proxyUrl.hostname;
      const port = parseInt(proxyUrl.port, 0);

      const tunnelOptions = {
        protocol: proxyUrl.protocol,
        host: hostName,
        port: port,
        headers: proxyHeaders
      };

      options.agent = <any>new HttpGotAdapter.ProxyAgent(tunnelOptions);
    }

    if (_.has(options, 'stream') && _.get(options, 'stream', false)) {
      const stream = <any>GOT(url, options);
      stream._ended = false;
      stream.once('response', (res: http.IncomingMessage) => {
        res.once('end', () => {
          stream._ended = true;
          stream.emit('finished');
        });
      });
      stream.asPromise = (): IHttpGotPromise<any> => {
        return <IHttpGotPromise<any>>new Promise<any>((resolve, reject) => {
          if (!stream._ended) {
            stream.once('finished', () => {
              resolve();
            });
            stream.once('error', (err: Error) => {
              reject(err);
            });
          } else {
            resolve();
          }
        });
      };
      return stream;
    }


    let p = null;
    if (options) {
      p = GOT[method](url, options);
    } else {
      p = GOT[method](url);
    }

    if (_.get(options, 'passBody', false)) {
      p = p.then((res: any) => {
        return res.body;
      });
    }

    return p.catch((err: Error) => {
      if (err.name === 'RequestError') {
        const e = new RequestError(err.message);
        _.assign(e, err);
        throw e;
      } else if (err.name === 'TimeoutError') {
        const e = new TimeoutError(err.message);
        _.assign(e, err);
        throw e;
      }
      throw err;
    });
  }


  isAvailable(logger?: ILoggerApi) {
    try {
      if (!HttpGotAdapter.GOT) {
        HttpGotAdapter.ProxyAgent = require('proxy-agent');
        HttpGotAdapter.GOT = require('got');
      }
      return true;
    } catch (e) {
      if (logger) {
        logger.warn('http got adapter: required got package is not installed. Adapter will not be used.');
      }
      return false;
    }
  }


  get(url: string, options?: IHttpGetOptions): IHttpGotPromise<any>;
  get(url: string, options?: IHttpGetOptions & { stream: boolean }): IHttpStream<any>;
  get(url: string, options?: IHttpGetOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
    return HttpGotAdapter.wrap(url, 'get', options);
  }


  post(url: string, options?: IHttpPostOptions): IHttpGotPromise<any>;
  post(url: string, options?: IHttpPostOptions & { stream: boolean }): IHttpStream<any>;
  post(url: string, options?: IHttpPostOptions & { stream: boolean }): IHttpGotPromise<any> | IHttpStream<any> {
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
