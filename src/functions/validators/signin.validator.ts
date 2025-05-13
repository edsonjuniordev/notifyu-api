import { z } from 'zod';
import { ZodError } from './types';

const signinSchema = z.object({
  email: z.string().email('invalid email').optional(),
  password: z.string().min(8, 'the password must have at least 8 characters').max(50, 'the password must have a maximum of 50 characters').optional(),
  apiKey: z.string().optional()
});

export class SigninValidator {
  public static validate(input: unknown): ZodError[] {
    try {
      signinSchema.parse(input);
    } catch (error) {
      const errors = error?.errors?.map((err) => ({
        field: err?.path.join('.'),
        message: err?.message,
      }));

      return errors;
    }
  }
}
