import { HttpClient } from "@/shared/interfaces/HttpClient";
import { User } from "../types/User";
import { UserRepository } from "../interfaces/UserRepository";
import { RegisterUserPayload } from "../interfaces/AuthService";
import { config } from "../../../config/environment";

export class UserRepositoryImpl implements UserRepository {
  private httpClient: HttpClient;
  private baseUrl: string;

  constructor(httpClient: HttpClient, baseUrl?: string) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl || config.apiBaseUrl;
  }

  async register(payload: RegisterUserPayload): Promise<User> {
    return this.httpClient.post<User>("users/register", payload);
  }
}
