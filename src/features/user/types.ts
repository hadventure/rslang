export type TUser = {
  name: string,
  email: string,
  password: string,
};

export type TAuth = {
  message: string,
  name: string,
  refreshToken: string
  token: string
  userId: string
};
