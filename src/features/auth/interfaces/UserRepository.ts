import { User } from "@/features/auth/types/User";
import { RegisterUserPayload } from "./AuthService";

export interface UserRepository {
  register(payload: RegisterUserPayload): Promise<User>;
}
