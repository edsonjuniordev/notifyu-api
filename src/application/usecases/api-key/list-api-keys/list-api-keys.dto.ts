export type ListApiKeysInputDto = {
  accountId: string;
}

export type ListApiKeysOutputDto = {
  apiKeys: {
    id: string;
    apiKey: string;
    createdAt: string;
  }[];
}
