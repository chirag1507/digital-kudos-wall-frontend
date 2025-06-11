import { useState } from "react";
import { RegisterUserUseCase } from "../application/RegisterUserUseCase";
import { RegisterUserPayload } from "../interfaces/AuthService";

// Define the dependency interface for the hook
export interface UseRegistrationDependencies {
  registerUserUseCase: RegisterUserUseCase;
}

export const useRegistration = ({ registerUserUseCase }: UseRegistrationDependencies) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
