import { renderHook, act } from "@testing-library/react";
import { useRegistration } from "./useRegistration";
import { RegisterUserUseCase } from "../application/use-cases/register-user/RegisterUserUseCase";
import { RegisterUserPayload } from "../interfaces/AuthService";
import { User } from "../types/User";
import { AuthServiceAdapter } from "../services/AuthServiceAdapter";
import { UserRepository } from "../repositories/UserRepository";
import { HttpClient } from "@/shared/interfaces/HttpClient";

const mockHttpClient: jest.Mocked<HttpClient> = {
  get: jest.fn(),
  post: jest.fn(),
};

const userRepository = new UserRepository(mockHttpClient);

const authService = new AuthServiceAdapter(userRepository);
const registerUserUseCase = new RegisterUserUseCase(authService);

describe("Sociable Unit Test: useRegistration Hook", () => {
  const payload: RegisterUserPayload = {
    name: "John Doe",
    email: "john@example.com",
    password: "ValidPassword123!",
  };

  const mockUser: User = {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Hook State Management", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should transition to success state after successful registration", async () => {
      mockHttpClient.post.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

      await act(async () => {
        await result.current.handleSubmit(payload);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should transition to error state when registration fails", async () => {
      const errorMessage = "Email already in use";
      mockHttpClient.post.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

      await act(async () => {
        await result.current.handleSubmit(payload);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });

    it("should display loading state during registration process", async () => {
      let resolveRegistration: (value: User) => void;
      const registrationPromise = new Promise<User>((resolve) => {
        resolveRegistration = resolve;
      });
      mockHttpClient.post.mockReturnValue(registrationPromise);

      const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

      act(() => {
        result.current.handleSubmit(payload);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(false);

      await act(async () => {
        resolveRegistration!(mockUser);
      });
    });

    it("should reset error state on new registration attempt", async () => {
      const errorMessage = "Email already in use";
      mockHttpClient.post.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

      await act(async () => {
        await result.current.handleSubmit(payload);
      });

      expect(result.current.error).toBe(errorMessage);

      mockHttpClient.post.mockResolvedValueOnce(mockUser);

      await act(async () => {
        await result.current.handleSubmit(payload);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
