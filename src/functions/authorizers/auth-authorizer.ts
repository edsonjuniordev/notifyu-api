import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import { generatePolicy } from './generate-policy';

function extractTokenFromHeader(event: APIGatewayRequestAuthorizerEventV2): string | undefined {
  const [type, token] = event.headers['authorization'].split(' ') ?? [];
  return type == 'Bearer' ? token : undefined;
}

export const handler = async (event: APIGatewayRequestAuthorizerEventV2,): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = extractTokenFromHeader(event);

    if (!token) {
      throw new Error('Unauthorized');
    }

    const payload = verify(token, process.env.JWT_SECRET);

    const context = {
      accountId: payload['accountId']
    };

    return generatePolicy(event.routeArn, context);
  } catch {
    throw new Error('Unauthorized');
  }
};
