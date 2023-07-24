export interface dataUpdated extends Object {
  photo?: string;
}

export interface userSingUp {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
  role?: string;
  phoneNumber?: string;
}
