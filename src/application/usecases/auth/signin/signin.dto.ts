export type SigninInputDto = {
  email?: string;
  password?: string;
  apiKey?: string;
}

export type SigninOutputDto = {
  token: string;
}
