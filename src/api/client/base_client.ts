// Add to base-client.ts
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
  }
}

export class ValidationError extends ApiError {
  constructor(public zodError: ZodError) {
    super('Validation failed', 422);
  }
}
