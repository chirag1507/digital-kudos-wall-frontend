import { HttpClient } from "@/shared/interfaces/HttpClient";
import { User } from "../types/User";
import { UserRepository } from "../interfaces/UserRepository";

export class UserRepositoryImpl implements UserRepository {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async register(user: Omit<User, "id">): Promise<User> {
    return this.httpClient.post<User>("/users/register", user);
  }
}
