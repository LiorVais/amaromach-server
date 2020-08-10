import mongoose from 'mongoose';
import AbstractLogger from 'src/core/logger/AbstractLogger';
import AbstractSetting from 'src/core/config/AbstractSetting';
import { IMongoConfig } from '../interfaces/IConfig';
import logger from 'src/core/logger/Logger';

export default class MongoConnector {
  private logger: AbstractLogger;
  constructor(private setting: AbstractSetting) {
    mongoose.connection.once('disconnected', () => logger.warn('Mongo connection disconnected'));
    mongoose.connection.once('reconnected', () => logger.warn('Mongo connection reconnected'));
    this.initMongoConnection(setting.config.db);
  }

  private initMongoConnection = (config: IMongoConfig) => {
    mongoose
      .connect('mongodb+srv://<user>:<pass>@cluster0.fdphe.mongodb.net/<dbName>?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: config.userName,
        pass: config.password,
        dbName: config.dbName,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 5000,
      })
      .then(
        () => logger.info('Connected To Mongo!'),
        (error) => logger.error('Failed to connect to mongo: ' + error),
      );
  };
}
