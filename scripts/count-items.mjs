import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
export const TABLE_NAME = 'notifyu_table_dev';
export const GSI2_INDEX_NAME = 'GSI2';
export const dynamoClient = DynamoDBDocumentClient.from(client);

async function countNotifications(tableName) {
  let totalCount = 0;
  let lastEvaluatedKey;

  do {
    // Query para buscar itens com PK = "NOTIFICATION"
    const queryParams = {
      TableName: tableName,
      IndexName: GSI2_INDEX_NAME,
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'NOTIFICATION',
      },
      ExclusiveStartKey: lastEvaluatedKey, // Paginação
      Select: 'COUNT', // Conta apenas os registros sem retornar os dados completos
    };

    const queryResult = await dynamoClient.send(new QueryCommand(queryParams));
    totalCount += queryResult.Count || 0; // Adiciona a contagem retornada na consulta
    lastEvaluatedKey = queryResult.LastEvaluatedKey; // Atualiza para a próxima página
  } while (lastEvaluatedKey); // Continua enquanto houver mais registros

  return totalCount;
}

// Exemplo de uso
(async () => {
  try {
    const totalNotifications = await countNotifications(TABLE_NAME);
    console.log(`Total de notificações: ${totalNotifications}`);
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
  }
})();
