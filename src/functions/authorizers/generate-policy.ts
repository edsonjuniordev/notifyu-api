import { APIGatewayAuthorizerResult, APIGatewayAuthorizerResultContext } from 'aws-lambda';

export function generatePolicy(resource: string, context: APIGatewayAuthorizerResultContext): APIGatewayAuthorizerResult {
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
