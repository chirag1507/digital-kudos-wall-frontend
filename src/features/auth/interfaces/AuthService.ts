import { User } from "../types/User";

export type RegisterUserPayload = Omit<User, "id"> & { password: string };

export interface AuthService {
  registerUser(payload: RegisterUserPayload): Promise<User>;
}
