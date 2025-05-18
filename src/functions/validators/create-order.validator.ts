import { z } from 'zod';
import { ZodError } from './types';

const createOrderSchema = z.object({
  planId: z.string()
});

export class CreateOrderValidator {
  public static validate(input: unknown): ZodError[] {
    try {
      createOrderSchema.parse(input);
    } catch (error) {
      const errors = error?.errors?.map((err) => ({
        field: err?.path.join('.'),
        message: err?.message,
      }));

      return errors;
    }
  }
}
