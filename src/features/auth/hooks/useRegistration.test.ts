import { renderHook, act } from "@testing-library/react";
import { useRegistration } from "./useRegistration";
import { RegisterUserUseCase } from "../application/use-cases/register-user/RegisterUserUseCase";
import { RegisterUserPayload } from "../interfaces/AuthService";
import { User } from "../types/User";
import { AuthServiceAdapter } from "../services/AuthServiceAdapter";
import { UserRepository } from "../interfaces/UserRepository";

// 1. Mock the repository (the true boundary)
const mockUserRepository: jest.Mocked<UserRepository> = {
  register: jest.fn(),
};

// 2. Use real collaborators for the application logic
const authService = new AuthServiceAdapter(mockUserRepository);
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
    // Arrange: Mock the repository's response
    mockUserRepository.register.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

    // Act
    await act(async () => {
      await result.current.handleSubmit(payload);
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockUserRepository.register).toHaveBeenCalledWith(payload);
  });

  it("should handle registration failure", async () => {
    // Arrange
    const errorMessage = "Email already in use";
    mockUserRepository.register.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

    // Act
    await act(async () => {
      await result.current.handleSubmit(payload);
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(mockUserRepository.register).toHaveBeenCalledWith(payload);
  });

  it("should set loading state during registration", async () => {
    // Arrange
    mockUserRepository.register.mockReturnValue(new Promise(() => {}));

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
