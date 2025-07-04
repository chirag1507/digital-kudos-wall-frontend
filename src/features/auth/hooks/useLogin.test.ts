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

  it("should handle successful login", async () => {
    // Arrange
    mockAuthService.login.mockResolvedValueOnce(mockLoginResult);

    // Act
    const { result } = renderHook(() => useLogin({ loginUseCase }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    let loginPromise;
    await act(async () => {
      loginPromise = result.current.login(mockCredentials);
    });
    await loginPromise;

    // Assert
    expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockLoginResult);
  });

  it("should handle login failure", async () => {
    // Arrange
    const error = new Error("Invalid credentials");
    mockAuthService.login.mockRejectedValueOnce(error);

    // Act
    const { result } = renderHook(() => useLogin({ loginUseCase }));

    let loginPromise;
    await act(async () => {
      loginPromise = result.current.login(mockCredentials).catch(() => {});
    });
    await loginPromise;

    // Assert
    expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.data).toBeNull();
  });

  it("should set loading state during login", async () => {
    // Arrange
    mockAuthService.login.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockLoginResult), 100))
    );

    // Act
    const { result } = renderHook(() => useLogin({ loginUseCase }));

    let loginPromise;
    act(() => {
      loginPromise = result.current.login(mockCredentials);
    });

    // Assert loading state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();

    // Wait for completion
    await loginPromise;
  });
});
