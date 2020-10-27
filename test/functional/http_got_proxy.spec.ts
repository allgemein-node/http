import {suite, test} from '@testdeck/mocha';
import {expect} from 'chai';
import {HttpFactory} from '../../src/libs/http/HttpFactory';
import {IHttp} from '../../src/libs/http/IHttp';

const HTTP_URL = 'http://example.com';
const HTTPS_URL = 'https://example.com';

const HTTPBIN_URL = 'http://httpbin.org/get';

const HTTP_URL_ERR = 'http://example-example-example.com/';
const HTTPS_URL_ERR = 'https://example-example-example.com/';

const LOCAL_PROXY = '127.0.0.1:3128';
const LOCAL_SSL_PROXY = '127.0.0.1:3129';

let http: IHttp;

/**
 * TODO
 */
@suite('functional/http_got_proxies')
class HttpGotProxySpec {


  static async before() {
    await HttpFactory.load();
    http = HttpFactory.$().create();
  }


  /**
   * http over http
   */
  @test
  async 'promise http over http'() {
    const res1 = await http.get(HTTP_URL, {proxy: `http://${LOCAL_PROXY}`, retry: 0});
    expect(res1.body).to.contain('<h1>Example Domain</h1>');
  }


  /**
   * https over http
   */
  @test
  async 'promise https over http'() {
    const res2 = await http.get(HTTPS_URL, {proxy: `http://${LOCAL_PROXY}`, retry: 0});
    expect(res2.body).to.contain('<h1>Example Domain</h1>');
  }

  // /**
  //  * faild https over http
  //  */
  // @test
  // async 'fails promise https over http'() {
  //   const res2 = await http.get(HTTPS_URL, {proxy: `http://does-not-exists.com:12345`, retry: 0});
  //
  // }

  // /**
  //  * http over https
  //  */
  // @test
  // async 'promise http over https'() {
  //   const res3 = await http.get(HTTP_URL, {proxy: `https://${LOCAL_SSL_PROXY}`, retry: 0});
  //   console.log(res3.body);
  // }
  //
  //
  // /**
  //  * https over https
  //  */
  // @test
  // async 'promise https over https'() {
  //   const res4 = await http.get(HTTPS_URL, {proxy: `https://${LOCAL_SSL_PROXY}`, retry: 0});
  //   console.log(res4.body);
  // }

}


