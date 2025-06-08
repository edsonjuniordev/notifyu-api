import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
export const TABLE_NAME = 'notifyu_table_dev';
export const GSI2_INDEX_NAME = 'GSI2';
export const dynamoClient = DynamoDBDocumentClient.from(client);

async function deleteNotifications(tableName) {
  let lastEvaluatedKey;

  do {
    // Query para buscar os itens com GSI2PK = "NOTIFICATION"
    const queryParams = {
      TableName: tableName,
      IndexName: GSI2_INDEX_NAME,
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'NOTIFICATION',
      },
      ExclusiveStartKey: lastEvaluatedKey, // Paginação
      Limit: 10, // Para processar em lotes menores
    };

    const queryResult = await dynamoClient.send(new QueryCommand(queryParams));
    const itemsToDelete = queryResult.Items || [];

    // Excluir os itens encontrados
    await Promise.all(itemsToDelete.map((item) => deleteItem(item)));

    lastEvaluatedKey = queryResult.LastEvaluatedKey; // Atualiza para a próxima página
  } while (lastEvaluatedKey); // Continua enquanto houver mais registros
}

async function deleteItem(item) {
  const deleteParams = {
    TableName: TABLE_NAME,
    Key: {
      PK: item.PK,
      SK: item.SK,
    },
  };
  try {
    await dynamoClient.send(new DeleteCommand(deleteParams));
    console.log(`Item deletado: PK=${item.PK}, SK=${item.SK}`);
  } catch (error) {
    console.error(`Erro ao deletar item: PK=${item.PK}, SK=${item.SK}`, error);
  }
}

// Exemplo de uso
(async () => {
  try {
    await deleteNotifications(TABLE_NAME);
    console.log('Todos os itens com PK=\'NOTIFICATION\' foram deletados.');
  } catch (error) {
    console.error('Erro ao deletar itens:', error);
  }
})();
