import { AuthService, RegisterUserPayload } from "../interfaces/AuthService";
import { User } from "../types/User";
import { UserRepository } from "../repositories/UserRepository";
import { LoginCredentials } from "../types/LoginCredentials";
import { LoginResult } from "../types/LoginResult";

export class AuthServiceAdapter implements AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(payload: RegisterUserPayload): Promise<User> {
    return this.userRepository.register(payload);
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    return this.userRepository.login(credentials);
  }
}
