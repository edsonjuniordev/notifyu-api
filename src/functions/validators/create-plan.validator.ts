import { z } from 'zod';
import { ZodError } from './types';

const createPlanSchema = z.object({
  name: z.string().min(3),
  notificationQuantity: z.number().min(100),
  amount: z.number().min(2500)
});

export class CreatePlanValidator {
  public static validate(input: unknown): ZodError[] {
    try {
      createPlanSchema.parse(input);
    } catch (error) {
      const errors = error?.errors?.map((err) => ({
        field: err?.path.join('.'),
        message: err?.message,
      }));

      return errors;
    }
  }
}
