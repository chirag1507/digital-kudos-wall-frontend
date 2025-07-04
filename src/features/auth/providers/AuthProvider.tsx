import { useMemo, ReactNode } from "react";
import { FetchHttpClient } from "@/services/FetchHttpClient";
import { UserRepository } from "../repositories/UserRepository";
import { AuthServiceAdapter } from "../services/AuthServiceAdapter";
import { LoginUseCase } from "../application/use-cases/login/LoginUseCase";
import { RegisterUserUseCase } from "../application/use-cases/register-user/RegisterUserUseCase";
import { config } from "@/config/environment";
import { AuthContext } from "../contexts/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const value = useMemo(() => {
    const httpClient = new FetchHttpClient(config.apiBaseUrl);
    const userRepository = new UserRepository(httpClient);
    const authService = new AuthServiceAdapter(userRepository);

    return {
      loginUseCase: new LoginUseCase(authService),
      registerUserUseCase: new RegisterUserUseCase(authService),
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
