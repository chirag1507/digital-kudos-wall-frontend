import { AuthService, RegisterUserPayload } from "../../../interfaces/AuthService";
import { User } from "../../../types/User";

export class RegisterUserUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(payload: RegisterUserPayload): Promise<User> {
    return this.authService.registerUser(payload);
  }
}
