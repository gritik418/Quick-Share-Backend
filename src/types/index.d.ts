export type UserLoginDataType = {
  email: string | null;
  password: string | null;
  password_confirmation: string | null;
};

export type JwtPayloadType = {
  id: string;
};
