import mongoose from 'mongoose';
import { IMongoConfig } from '../interfaces/IConfig';
import logger from 'src/core/logger/Logger';

export const initMongoLogs = () => {
  mongoose.connection.on('disconnected', () => logger.warn('Mongo connection disconnected'));
  mongoose.connection.on('reconnected', () => logger.warn('Mongo connection reconnected'));
};

export const initMongoConnection = (config: IMongoConfig) => {
  mongoose
    .connect(config.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: config.user,
      pass: config.password,
      dbName: config.dbName,
      serverSelectionTimeoutMS: config.serverSelectionTimeoutMS,
      heartbeatFrequencyMS: config.heartbeatFrequencyMS,
    })
    .then(
      () => logger.info('Connected To Mongo!'),
      (error) => logger.error('Failed to connect to mongo: ' + error),
    );
};
