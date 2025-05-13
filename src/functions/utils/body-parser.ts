export class BodyParser{
  public static parse<T>(body: string): T {
    try {
      if (!body) {
        throw new Error('empty body');
      }
      return JSON.parse(body);
    } catch  {
      throw new Error('invalid JSON');
    }
  }
}
