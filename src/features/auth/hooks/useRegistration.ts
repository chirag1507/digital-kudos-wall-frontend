import { useState, useMemo } from "react";
import { RegisterUserUseCase } from "../application/registerUser";
import { AuthServiceAdapter } from "../services/AuthServiceAdapter";
import { RegisterUserPayload } from "../interfaces/AuthService";

export const useRegistration = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const registerUserUseCase = useMemo(() => {
    const authService = new AuthServiceAdapter();
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
