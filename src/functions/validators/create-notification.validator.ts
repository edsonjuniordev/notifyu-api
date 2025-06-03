import { z } from 'zod';
import { ZodError } from './types';
import { NotificationType } from 'src/application/domain/entities/notification.entity';
import { Datetime } from 'src/application/utils/datetime';

const maxSizeInKB = 100;
const maxSizeInBytes = maxSizeInKB * 1024;

const createNotificationSchema = z.object({
  payload: z.any().refine((data) => {
    try {
      const jsonString = JSON.stringify(data);
      return Buffer.byteLength(jsonString, 'utf-8') <= maxSizeInBytes;
    } catch {
      return false;
    }
  },
    {
      message: `payload must not be larger than ${maxSizeInKB} KB.`,
    }
  ),
  notificationDate: z.string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      { message: 'notificationDate must be a valid ISO date string' }
    )
    .refine(
      (value) => Datetime.addHoursToIsoString(new Date(value).toISOString(), 3) >= new Date().toISOString(),
      { message: 'notificationDate cannot be in the past.' }
    ),
  destination: z.string().min(3),
  notificationType: z.nativeEnum(NotificationType)
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
