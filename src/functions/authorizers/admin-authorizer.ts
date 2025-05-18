import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEventV2 } from 'aws-lambda';
import { generatePolicy } from './generate-policy';

export const handler = async (event: APIGatewayRequestAuthorizerEventV2,): Promise<APIGatewayAuthorizerResult> => {
  try {
    const apiKey = event.headers['authorization'];

    if (!apiKey) {
      throw new Error('Unauthorized');
    }

    if (apiKey !== process.env.ADMIN_API_KEY) {
      throw new Error('Unauthorized');
    }

    return generatePolicy(event.routeArn, {});
  } catch {
    throw new Error('Unauthorized');
  }
};


