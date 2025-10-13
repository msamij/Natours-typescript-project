export class ErrorHandler extends Error {
  constructor(public message: string, public status?: string, public statusCode?: number) {
    super(message);
  }
}
