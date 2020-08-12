export class ValidationError extends Error {
  status: number;
  originalError: Error;
  constructor(message: string, err: Error) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.status = 400;
    this.originalError = err;
  }
}
