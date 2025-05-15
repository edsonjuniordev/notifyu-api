import { ulid } from 'ulid';

export class GenerateULID {
  static generate(): string {
    return ulid();
  }
}
