import { z } from 'zod';
import { ZodError } from './types';

const maxSizeInKB = 100;
const maxSizeInBytes = maxSizeInKB * 1024;

const createNotificationSchema = z.object({
  payload: z.string().refine((data) => Buffer.byteLength(data, 'utf-8') <= maxSizeInBytes,
    {
      message: `payload must not be larger than ${maxSizeInKB} KB.`,
    }
  ),
  notificationDate: z.string().refine(
    (value) => !isNaN(Date.parse(value)),
    { message: 'notificationDate must be a valid ISO date string' }
  ),
});

export class CreateNotificationValidator {
  public static validate(input: unknown): ZodError[] {
    try {
      createNotificationSchema.parse(input);
    } catch (error) {
      const errors = error?.errors?.map((err) => ({
        field: err?.path.join('.'),
        message: err?.message,
      }));

      return errors;
    }
  }
}
