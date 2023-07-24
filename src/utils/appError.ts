export class AppError extends Error {
  public readonly statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(<string>message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this);
  }
}
