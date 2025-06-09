import { useState, useMemo } from "react";
import { RegisterUserUseCase } from "../application/RegisterUserUseCase";
import { AuthServiceAdapter } from "../services/AuthServiceAdapter";
import { UserRepositoryImpl } from "../repositories/UserRepository";
import { RegisterUserPayload } from "../interfaces/AuthService";
import { FetchHttpClient } from "@/services/FetchHttpClient";

export const useRegistration = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const registerUserUseCase = useMemo(() => {
    const httpClient = new FetchHttpClient();
    const userRepository = new UserRepositoryImpl(httpClient);
    const authService = new AuthServiceAdapter(userRepository);
    return new RegisterUserUseCase(authService);
  }, []);

  const handleSubmit = async (payload: RegisterUserPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUserUseCase.execute(payload);
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    isSuccess,
    handleSubmit,
  };
};
