import { apiClient } from "@/services/apiClient";
import { AuthService, RegisterUserPayload, User } from "../interfaces/AuthService";

export class AuthServiceAdapter implements AuthService {
  registerUser(payload: RegisterUserPayload): Promise<User> {
    return apiClient.registerUser(payload);
  }
}
