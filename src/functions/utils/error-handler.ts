import { ResponseParser } from './response-parser';

export class ErrorHandler {
  public static handle(error: Error) {
    switch (error.message) {
      case 'empty body':
        return ResponseParser.parse(400, { message: error.message });
      case 'invalid JSON':
        return ResponseParser.parse(400, { message: error.message });
      case 'user already exists':
        return ResponseParser.parse(409, { message: error.message });
      case 'account not found':
        return ResponseParser.parse(404, { message: error.message });
      case 'invalid password':
        return ResponseParser.parse(401, { message: error.message });
      case 'invalid api key':
        return ResponseParser.parse(401, { message: error.message });
      case 'account without sufficient http notification':
        return ResponseParser.parse(400, { message: error.message });
      default:
        console.log('Error: ', error);
        return ResponseParser.parse(500, { message: 'internal server error' });
    }
  }
}
