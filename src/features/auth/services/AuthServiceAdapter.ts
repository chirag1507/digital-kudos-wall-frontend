import { AuthService, RegisterUserPayload } from "../interfaces/AuthService";
import { UserRepository } from "../interfaces/UserRepository";
import { User } from "../types/User";

export class AuthServiceAdapter implements AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  registerUser(payload: RegisterUserPayload): Promise<User> {
    return this.userRepository.register(payload);
  }
}
