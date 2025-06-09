import { AuthService, RegisterUserPayload, User } from "../interfaces/AuthService";

export class RegisterUserUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(payload: RegisterUserPayload): Promise<User> {
    return this.authService.registerUser(payload);
  }
}
