// Add to base-client.ts
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }


  static getMessage(error: unknown): string {
    console.error('API Error:', error);
    if (error instanceof ApiError) {
      return error.message;
    } else if (error instanceof ZodError) {
      return error.errors.map(e => e.message).join(', ');
    } else if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
}

export class ValidationError extends ApiError {
  constructor(public zodError: ZodError) {
    super('Validation failed' + zodError, 666);
  }
}
