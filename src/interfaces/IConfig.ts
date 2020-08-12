export interface IMongoConfig {
  connectionString: String;
  dbName: String;
  user: String;
  password: String;
  serverSelectionTimeoutMS: number;
  heartbeatFrequencyMS: number;
}

export interface ILoggerConfig {
  level: string;
  filename: string;
  filedir: string;
}
