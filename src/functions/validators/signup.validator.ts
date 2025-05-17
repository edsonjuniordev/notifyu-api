import { z } from 'zod';
import { ZodError } from './types';

const signupSchema = z.object({
  name: z.string().min(3, 'the name must have at least 3 characters').max(50, 'the name must have a maximum of 50 characters'),
  email: z.string().email('invalid email'),
  document: z.string().regex(/^[0-9]{11}$/),
  password: z.string().min(8, 'the password must have at least 8 characters').max(50, 'the password must have a maximum of 50 characters')
});

export class SignupValidator {
  public static validate(input: unknown): ZodError[] {
    try {
      signupSchema.parse(input);
    } catch (error) {
      const errors = error?.errors?.map((err) => ({
        field: err?.path.join('.'),
        message: err?.message,
      }));

      return errors;
    }
  }
}
