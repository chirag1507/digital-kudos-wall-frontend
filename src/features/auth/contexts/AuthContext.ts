import { createContext } from "react";
import { LoginUseCase } from "../application/use-cases/login/LoginUseCase";
import { RegisterUserUseCase } from "../application/use-cases/register-user/RegisterUserUseCase";

export interface AuthContextValue {
  loginUseCase: LoginUseCase;
  registerUserUseCase: RegisterUserUseCase;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
