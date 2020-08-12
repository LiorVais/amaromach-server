import fs from 'fs';
import winston from 'winston';
import nconf from 'nconf';
import DailyRotate from 'winston-daily-rotate-file';
import AbstractLogger from 'src/core/logger/AbstractLogger';
import { ILoggerConfig } from '../../interfaces/IConfig';

const { format } = winston;

class Logger extends AbstractLogger {
  private logger: winston.Logger;

  constructor(private config: ILoggerConfig) {
    super();
    this.checkForLogFileDir();
    this.initializeLogger();
  }

  public log(level: string, message: string): void {
    this.logger.log(level.toLowerCase(), message);
  }

  private checkForLogFileDir(): void {
    const dir = this.config.filedir;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  private initializeLogger(): void {
    this.logger = winston.createLogger({
      level: this.config.level,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new DailyRotate({
          filename: this.config.filename,
          dirname: this.config.filedir,
          maxSize: 20971520, // 20MB
          maxFiles: 25,
          datePattern: 'DD-MM-YYYY',
        }),
      ],
    });
  }
}

export default new Logger(nconf.get('log'));
