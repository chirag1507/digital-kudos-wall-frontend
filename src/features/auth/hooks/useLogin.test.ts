import { renderHook, act } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { LoginCredentials } from "../types/LoginCredentials";
import { LoginResult } from "../types/LoginResult";
import { AuthService } from "../interfaces/AuthService";
import { LoginUseCase } from "../application/use-cases/login/LoginUseCase";

describe("Sociable Unit Test: useLogin Hook", () => {
  const mockCredentials: LoginCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  const mockLoginResult: LoginResult = {
    user: {
      id: "123",
      email: "test@example.com",
      name: "Test User",
    },
    token: "jwt.token.here",
  };

  // Mock the AuthService (our true boundary)
  const mockAuthService: jest.Mocked<AuthService> = {
    login: jest.fn(),
    registerUser: jest.fn(),
  };

  // Use a real LoginUseCase (our application logic)
  const loginUseCase = new LoginUseCase(mockAuthService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Hook State Management", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() => useLogin({ loginUseCase }));

      // Assert: Test initial state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeNull();
      expect(typeof result.current.login).toBe("function");
    });

    it("should transition to success state after successful login", async () => {
      // Arrange: Mock successful login response
      mockAuthService.login.mockResolvedValueOnce(mockLoginResult);

      const { result } = renderHook(() => useLogin({ loginUseCase }));

      // Act: Trigger login
      let loginPromise;
      await act(async () => {
        loginPromise = result.current.login(mockCredentials);
      });
      await loginPromise;

      // Assert: Test success state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockLoginResult);
    });

    it("should transition to error state when login fails", async () => {
      // Arrange: Mock login error
      const error = new Error("Invalid credentials");
      mockAuthService.login.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogin({ loginUseCase }));

      // Act: Trigger failed login
      let loginPromise;
      await act(async () => {
        loginPromise = result.current.login(mockCredentials).catch(() => {});
      });
      await loginPromise;

      // Assert: Test error state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe("Invalid credentials");
      expect(result.current.data).toBeNull();
    });

    it("should display loading state during login process", async () => {
      // Arrange: Mock pending promise to simulate loading
      let resolveLogin: (value: LoginResult) => void;
      const loginPromise = new Promise<LoginResult>((resolve) => {
        resolveLogin = resolve;
      });
      mockAuthService.login.mockReturnValue(loginPromise);

      const { result } = renderHook(() => useLogin({ loginUseCase }));

      // Act: Start login process
      let userLoginPromise;
      act(() => {
        userLoginPromise = result.current.login(mockCredentials);
      });

      // Assert: Test loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeNull();

      // Cleanup: Resolve promise to avoid hanging test
      await act(async () => {
        resolveLogin!(mockLoginResult);
      });
      await userLoginPromise;
    });

    it("should reset error state on new login attempt", async () => {
      // Arrange: Start with error state
      const error = new Error("Invalid credentials");
      mockAuthService.login.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useLogin({ loginUseCase }));

      // Act: First attempt (fails)
      let firstLoginPromise;
      await act(async () => {
        firstLoginPromise = result.current.login(mockCredentials).catch(() => {});
      });
      await firstLoginPromise;

      // Assert: Confirm error state
      expect(result.current.error).toBe("Invalid credentials");

      // Arrange: Mock successful second attempt
      mockAuthService.login.mockResolvedValueOnce(mockLoginResult);

      // Act: Second attempt (succeeds)
      let secondLoginPromise;
      await act(async () => {
        secondLoginPromise = result.current.login(mockCredentials);
      });
      await secondLoginPromise;

      // Assert: Test state transition from error to success
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockLoginResult);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
