// Models
export type AuthToken = {
  token: string;
  expiration: Date | string;
};

export type Token = {
  token: string;
  expiration: Date | string;
  device: string;
};

export type User = {
  uuid?: string;
  admin?: boolean;
};

export type UserData = {
  tokens: Token[];
  email: string;
};
