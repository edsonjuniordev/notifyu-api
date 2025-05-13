export class GenerateUUID {
  static generate(): string {
    return crypto.randomUUID();
  }
}
