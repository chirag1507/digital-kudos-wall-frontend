export interface User {
  id: string;
  email: string;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
}

export interface AuthService {
  registerUser(payload: RegisterUserPayload): Promise<User>;
}
