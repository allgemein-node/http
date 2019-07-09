import * as https from 'https';

export interface IHttpOptions extends https.RequestOptions {
  proxy?: string;
  retry?: number;
  json?: boolean;
  responseType?: 'string' | 'buffer' | 'json';
  passBody?: boolean;
}
