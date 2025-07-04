import { User } from "./User";

export interface LoginResult {
  user: User;
  token: string;
}
