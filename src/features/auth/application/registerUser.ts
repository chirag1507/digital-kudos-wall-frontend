import { apiClient, RegisterUserPayload, User } from "@/services/apiClient";

export interface IAuthService {
  registerUser(payload: RegisterUserPayload): Promise<User>;
}

export class RegisterUserUseCase {
  constructor(private readonly authService: IAuthService) {}

  async execute(payload: RegisterUserPayload): Promise<User> {
    return this.authService.registerUser(payload);
  }
}

const authService: IAuthService = {
  registerUser: apiClient.registerUser,
};

export const registerUser = new RegisterUserUseCase(authService);
