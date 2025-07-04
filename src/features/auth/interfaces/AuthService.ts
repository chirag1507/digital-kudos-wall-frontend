import { User } from "../types/User";
import { LoginCredentials } from "../types/LoginCredentials";
import { LoginResult } from "../types/LoginResult";

export type RegisterUserPayload = Omit<User, "id"> & { password: string };

export interface AuthService {
  registerUser(payload: RegisterUserPayload): Promise<User>;
  login(credentials: LoginCredentials): Promise<LoginResult>;
}
