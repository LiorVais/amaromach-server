import AbstractSetting from 'src/core/config/AbstractSetting';
import { IConfig } from 'src/interfaces/IConfig';
import { isString } from 'lodash';
import devConfig from 'src/core/config/config.dev';
import prodConfig from 'src/core/config/config.prod';

export default class Settings extends AbstractSetting {
  private settings: IConfig;

  constructor() {
    super();
    const nodeEnv = process.env.NODE_ENV;
    this.settings = isString(nodeEnv) && nodeEnv.includes('prod') ? prodConfig : devConfig;
  }

  public get config(): IConfig {
    return this.settings;
  }
}
