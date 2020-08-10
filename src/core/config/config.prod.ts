import * as path from 'path';
import { IConfig } from 'src/interfaces/IConfig';

const config: IConfig = {
  server: {
    port: 3000,
  },
  db: {
    userName: 'amaromach',
    password: 'amaromach',
    dbName: 'amaromach',
  },
  log: {
    level: 'info',
    filename: 'log.txt',
    filedir: path.join(__dirname, '../../log'),
  },
};

export default config;
