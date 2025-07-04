import { renderHook, act } from "@testing-library/react";
import { useRegistration } from "./useRegistration";
import { RegisterUserUseCase } from "../application/use-cases/register-user/RegisterUserUseCase";
import { RegisterUserPayload } from "../interfaces/AuthService";
import { User } from "../types/User";
import { AuthServiceAdapter } from "../services/AuthServiceAdapter";
import { UserRepository } from "../repositories/UserRepository";
import { HttpClient } from "@/shared/interfaces/HttpClient";

// 1. Mock the HTTP client (the true boundary)
const mockHttpClient: jest.Mocked<HttpClient> = {
  get: jest.fn(),
  post: jest.fn(),
};

// 2. Use real UserRepository with mocked HTTP client
const userRepository = new UserRepository(mockHttpClient);

// 3. Use real collaborators for the application logic
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

  it("should handle successful registration", async () => {
    // Arrange: Mock the HTTP client's response
    mockHttpClient.post.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

    // Act
    await act(async () => {
      await result.current.handleSubmit(payload);
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockHttpClient.post).toHaveBeenCalledWith("/users/register", payload);
  });

  it("should handle registration failure", async () => {
    // Arrange
    const errorMessage = "Email already in use";
    mockHttpClient.post.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

    // Act
    await act(async () => {
      await result.current.handleSubmit(payload);
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(mockHttpClient.post).toHaveBeenCalledWith("/users/register", payload);
  });

  it("should set loading state during registration", async () => {
    // Arrange
    mockHttpClient.post.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

    // Act
    act(() => {
      result.current.handleSubmit(payload);
    });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(false);
  });
});
