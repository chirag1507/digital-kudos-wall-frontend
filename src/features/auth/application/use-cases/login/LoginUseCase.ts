import { AuthService } from "../../../interfaces/AuthService";
import { LoginCredentials } from "../../../types/LoginCredentials";
import { LoginResult } from "../../../types/LoginResult";

export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.authService.login(credentials);
  }
}
