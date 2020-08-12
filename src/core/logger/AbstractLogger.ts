export default abstract class AbstractLogger {
  public abstract log(level: string, message: string): void;

  public error(message: string): void {
    this.log('ERROR', message);
  }

  public warn(message: string): void {
    this.log('WARN', message);
  }

  public info(message: string): void {
    this.log('INFO', message);
  }

  public debug(message: string): void {
    this.log('DEBUG', message);
  }

  public verbose(message: string): void {
    this.log('VERBOSE', message);
  }
}
