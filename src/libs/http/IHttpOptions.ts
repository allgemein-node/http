import * as https from 'https';

export interface IHttpOptions extends https.RequestOptions {
  proxy?: string;
  proxyHeaders?: any;
  retry?: number;
  responseType?: 'string' | 'buffer' | 'json';
  passBody?: boolean;
}
