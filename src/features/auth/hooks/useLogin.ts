import { useState } from "react";
import { LoginUseCase } from "../application/use-cases/login/LoginUseCase";
import { LoginCredentials } from "../types/LoginCredentials";
import { LoginResult } from "../types/LoginResult";

interface LoginState {
  isLoading: boolean;
  error: string | null;
  data: LoginResult | null;
}

interface UseLoginProps {
  loginUseCase: LoginUseCase;
}

export const useLogin = ({ loginUseCase }: UseLoginProps) => {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await loginUseCase.execute(credentials);
      setState({ isLoading: false, error: null, data: result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      setState({ isLoading: false, error: errorMessage, data: null });
      throw error;
    }
  };

  return {
    login,
    isLoading: state.isLoading,
    error: state.error,
    data: state.data,
  };
};
