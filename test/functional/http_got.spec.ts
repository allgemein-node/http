import {suite, test, timeout} from "mocha-typescript";
import {expect} from "chai";
import {HttpFactory} from "../../src/libs/http/HttpFactory";
import {IHttp} from "../../src/libs/http/IHttp";
import {Transform} from "stream";
import {RequestError} from "../../src/libs/errors/RequestError";

const HTTP_URL = 'http://example.com';
const HTTPS_URL = 'https://example.com';

const HTTP_URL_ERR = 'http://example-example-example.com/';
const HTTPS_URL_ERR = 'https://example-example-example.com/';

let http: IHttp;

/**
 * TODO
 */
@suite('functional/http_got') @timeout(20000)
class Http_gotSpec {


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
   * http.get as promise
   */
  @test
  async 'http get promise'() {
    let res = await http.get(HTTP_URL);
    expect(res.body).to.contain('This domain is established to be used for illustrative examples in documents.');
  }

  /**
   * http.get as stream
   */
  @test
  async 'http get stream'() {
    let content = '';
    let res = http.get(HTTP_URL, {stream: true});
    res.pipe(new Transform({
      transform(chunk: any, encoding: string, callback: (error?: (Error | null), data?: any) => void): void {
        content = content + chunk.toString();
      }
    }));
    await res.asPromise();
    expect(content).to.contain('This domain is established to be used for illustrative examples in documents.');
  }

  /**
   * http.get as promise
   */
  @test
  async 'https get promise'() {
    let res = await http.get(HTTPS_URL);
    expect(res.body).to.contain('This domain is established to be used for illustrative examples in documents.');
  }

  /**
   * http.get as stream
   */
  @test
  async 'https get stream'() {
    let content = '';
    let res = http.get(HTTPS_URL, {stream: true});
    res.pipe(new Transform({
      transform(chunk: any, encoding: string, callback: (error?: (Error | null), data?: any) => void): void {
        content = content + chunk.toString();
      }
    }));
    await res.asPromise();
    expect(content).to.contain('This domain is established to be used for illustrative examples in documents.');
  }


  /**
   * http.get as promise failed
   */
  @test
  async 'http get promise fail'() {
    try {
      let res = await http.get(HTTP_URL_ERR, {timeout: 500});
      expect(true).to.be.false
    } catch (err) {
      expect(err).to.be.instanceOf(RequestError);
    }
  }

  /**
   * http.get as promise failed
   */
  @test
  async 'https get promise fail'() {
    try {
      let res = await http.get(HTTPS_URL_ERR, {timeout: 500});
      expect(true).to.be.false
    } catch (err) {
      expect(err).to.be.instanceOf(RequestError);
    }
  }

  /**
   * http.get as promise failed
   */
  @test
  async 'http get promise timeout'() {
    try {
      let res = await http.get(HTTP_URL_ERR, {timeout: 10});
      expect(true).to.be.false
    } catch (err) {
      expect(err).to.be.instanceOf(RequestError);
    }
  }

}


