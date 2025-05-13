export class ResponseParser {
  public static parse(statusCode: number, body?: unknown): object {
    return {
      statusCode,
      body: body ? JSON.stringify(body) : undefined,
    };
  }
}
