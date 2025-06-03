import { z } from 'zod';
import { ZodError } from './types';

const createPlanSchema = z.object({
  name: z.string().min(3),
  httpNotificationQuantity: z.number().min(10),
  amount: z.number()
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
