export class AppError extends Error {
  [key: string]: any;
  isOperational: boolean;

  constructor(public message: string, public statusCode: number, public status?: string) {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
