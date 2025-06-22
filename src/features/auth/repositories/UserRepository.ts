import { HttpClient } from "@/shared/interfaces/HttpClient";
import { User } from "../types/User";
import { UserRepository } from "../interfaces/UserRepository";
import { RegisterUserPayload } from "../interfaces/AuthService";

export class UserRepositoryImpl implements UserRepository {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async register(payload: RegisterUserPayload): Promise<User> {
    return this.httpClient.post<User>("users/register", payload);
  }
}
