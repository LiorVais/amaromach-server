import fs from 'fs';
import winston from 'winston';
import DailyRotate from 'winston-daily-rotate-file';
import AbstractSetting from 'src/core/config/AbstractSetting';
import AbstractLogger from 'src/core/logger/AbstractLogger';
import Settings from '../config/Settings';

const { format } = winston;

class Logger extends AbstractLogger {
  private logger: winston.Logger;

  constructor(private settings: AbstractSetting) {
    super();
    this.checkForLogFileDir();
    this.initializeLogger();
  }

  public log(level: string, message: string): void {
    this.logger.log(level.toLowerCase(), message);
  }

  private checkForLogFileDir(): void {
    const dir = this.settings.config.log.filedir;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  private initializeLogger(): void {
    this.logger = winston.createLogger({
      level: this.settings.config.log.level,
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new DailyRotate({
          filename: this.settings.config.log.filename,
          dirname: this.settings.config.log.filedir,
          maxSize: 20971520, // 20MB
          maxFiles: 25,
          datePattern: 'DD-MM-YYYY',
        }),
      ],
    });
  }
}

export default new Logger(new Settings());
