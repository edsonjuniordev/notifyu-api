import { z } from 'zod';
import { ZodError } from './types';
import { WebhookEventType } from '../webhook/webhook.dto';

const webhookSchema = z.object({
  event: z.nativeEnum(WebhookEventType),
  payment: z.object({
    externalReference: z.string()
  })
});

export class WebhookValidator {
  public static validate(input: unknown): ZodError[] {
    try {
      webhookSchema.parse(input);
    } catch (error) {
      const errors = error?.errors?.map((err) => ({
        field: err?.path.join('.'),
        message: err?.message,
      }));

      return errors;
    }
  }
}
