import {suite, test, timeout} from "mocha-typescript";
import {expect} from "chai";
import {HttpFactory} from "../../src/libs/http/HttpFactory";
import {IHttp} from "../../src/libs/http/IHttp";
import {Transform} from "stream";
import {RequestError} from "../../src/libs/errors/RequestError";

const HTTP_URL = 'http://example.com';
const HTTPS_URL = 'https://example.com';

const HTTPBIN_URL = 'http://httpbin.org/post';

const HTTP_URL_ERR = 'http://example-example-example.com/';
const HTTPS_URL_ERR = 'https://example-example-example.com/';

let http: IHttp;

/**
 * TODO
 */
@suite('functional/http_got_post') @timeout(20000)
class Http_got_postSpec {


  static async before() {
    await HttpFactory.load();
    http = HttpFactory.$().create();
  }

  /**
   * Get default adapter name
   */
  @test
  async 'config'() {
    let adapterDefault = await HttpFactory.$().getDefault();
    expect(adapterDefault).to.be.eq('got');
  }

  /**
   * http.post as promise
   */
  @test
  async 'http post promise'() {
    let res = await http.post(HTTPBIN_URL);
    expect(res.body).to.contain('"args": {}');
    let json = JSON.parse(res.body);
    expect(json).to.be.deep.include({args: {}});
  }

  /**
   * http.post as promise
   */
  @test
  async 'http post promise, body as json'() {
    let res = await http.post(HTTPBIN_URL, {body: JSON.stringify({data: {x: 'y'}})});
    expect(res.body).to.contain('"args": {}');
    let json = JSON.parse(res.body);
    expect(json).to.be.deep.include({args: {}, data: JSON.stringify({data: {x: 'y'}})});
  }

  /**
   * http.post as promise
   */
  @test
  async 'http post promise, body as json and return'() {
    let res = await http.post(HTTPBIN_URL, {body: {data: {x: 'y'}}, json: true});
    expect(res.body).to.be.deep.include({args: {}});
  }

  /**
   * http.post promise pass body
   */
  @test
  async 'http post promise pass body'() {
    let res = await http.post(HTTPBIN_URL, {body: {data: {x: 'y'}}, json: true, passBody: true});
    expect(res).to.be.deep.include({args: {}});
  }


}


