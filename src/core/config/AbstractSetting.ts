import { IConfig } from 'src/interfaces/IConfig';

export default abstract class AbstractSetting {
  public abstract get config(): IConfig;
}
