import { APIGatewayProxyEventV2 } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEventV2) {
  console.log('🚀 ~ handler ~ event:', event.requestContext['authorizer']['lambda']['accountId']);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello, world!',
    }),
  };
}
