import * as _ from "lodash";
import {ILoggerApi} from "commons-base/browser"
import {IHttp} from "./IHttp";
import {ClassType} from "../Constants";
import {HttpGotAdapter} from "../../adapters/http/got/HttpGotAdapter";


export class HttpFactory {

  private static __self__: HttpFactory;

  private adapters: { [key: string]: ClassType<IHttp> } = {};

  private defaultAdapter: string;

  private loggerApi: ILoggerApi;

  /**
   * Method to create singleton for this class
   */
  static $() {
    if (!this.__self__) {
      this.__self__ = new HttpFactory();
    }
    return this.__self__;
  }

  /**
   * Initialize factory and default got adapter (if installed)
   */
  static async load() {
    await this.$().register(HttpGotAdapter);
    return this.$();
  }

  /**
   * Register http adapter classes, the first added adapter will be the default at startup.
   *
   * @param clazz
   */
  async register(clazz: ClassType<IHttp>) {
    const adapter: IHttp = Reflect.construct(clazz, []);
    if (adapter) {
      if (!_.has(this.adapters, adapter.name) && await adapter.isAvailable()) {
        if (_.keys(this.adapters).length == 0) {
          this.defaultAdapter = adapter.name;
        }
        this.adapters[adapter.name] = clazz;
        return true;
      }
    }
    return false;
  }

  /**
   * Set default adapter name
   *
   * @param name
   */
  setDefault(name: string) {
    if (_.has(this.adapters, name)) {
      this.defaultAdapter = name;
      return true;
    }
    return false;
  }

  /**
   * Get default adapter name
   */
  getDefault() {
    return this.defaultAdapter;
  }

  /**
   * Get an existing http adapter
   *
   * @param name
   */
  create(name: string = null): IHttp {
    if (!name) {
      name = this.defaultAdapter;
    }
    if (!name) {
      throw new Error('http factory: no default adapter defined. ' + _.keys(this.adapters))
    }

    if (_.has(this.adapters, name)) {
      return Reflect.construct(this.adapters[name], []);
    } else {
      throw new Error('http factory: no adapter with "' + name + '" defined.')
    }


  }
}
