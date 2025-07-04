import { HttpClient } from "@/shared/interfaces/HttpClient";
import { LoginCredentials } from "../types/LoginCredentials";
import { LoginResult } from "../types/LoginResult";
import { User } from "../types/User";
import { RegisterUserPayload } from "../interfaces/AuthService";

export class UserRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async register(payload: RegisterUserPayload): Promise<User> {
    return this.httpClient.post<User>("/users/register", payload);
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    return this.httpClient.post<LoginResult>("/users/login", credentials);
  }
}
