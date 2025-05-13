import { APIGatewayAuthorizerResult, APIGatewayAuthorizerResultContext, APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda';
import { verify } from 'jsonwebtoken';

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

function generatePolicy(resource: string, context: APIGatewayAuthorizerResultContext): APIGatewayAuthorizerResult {
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: resource,
        },
      ],
    },
    context
  };
}
