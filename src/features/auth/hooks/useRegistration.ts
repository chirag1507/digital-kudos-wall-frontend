import { useState } from "react";
import { registerUser } from "../application/registerUser";
import { RegisterUserPayload } from "@/services/apiClient";

export const useRegistration = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (payload: RegisterUserPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser.execute(payload);
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
