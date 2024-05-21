export type UserLoginDataType = {
  email: string;
  password: string;
};

export type UserSignupDataType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type VerifyEmailDataType = {
  email: string;
  secretKey: string;
};

export type JwtPayloadType = {
  id: string;
};
