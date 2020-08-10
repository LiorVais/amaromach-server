export interface IConfig {
  server: IServerConfig;
  db: IMongoConfig;
  log: ILoggerConfig;
}

interface IServerConfig {
  port: number;
}

export interface IMongoConfig {
  dbName: String;
  userName: String;
  password: String;
}

interface ILoggerConfig {
  level: string;
  filename: string;
  filedir: string;
}
