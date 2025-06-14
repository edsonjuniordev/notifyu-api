import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
export const TABLE_NAME = `notifyu_table_${process.env.STAGE}`;
export const GSI1_INDEX_NAME = 'GSI1';
export const GSI2_INDEX_NAME = 'GSI2';
export const GSI3_INDEX_NAME = 'GSI3';
export const dynamoClient = DynamoDBDocumentClient.from(client);
