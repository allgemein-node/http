import * as https from "https";

export interface IHttpOptions extends https.RequestOptions {
  proxy?: string;
  retry?: number;
}
