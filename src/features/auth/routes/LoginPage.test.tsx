import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { AuthProvider } from "../providers/AuthProvider";
import { FetchHttpClient } from "@/services/FetchHttpClient";
import { LoginResult } from "../types/LoginResult";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/services/FetchHttpClient");
jest.mock("@/config/environment", () => ({
  config: {
    apiBaseUrl: "http://localhost:3000",
  },
}));

describe("Component Test: LoginPage", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  describe("Component State Rendering", () => {
    it("should render login form in default state", () => {
      renderLoginPage();

      // use Page Objects
      expect(screen.getByTestId("login-title")).toHaveTextContent("Sign In");
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
    });

    it("should display error state when login fails", async () => {
      const mockError = new Error("Invalid credentials");
      (FetchHttpClient.prototype.post as jest.Mock).mockRejectedValueOnce(mockError);

      renderLoginPage();

      await act(async () => {
        await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
      });

      await act(async () => {
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
      });

      await waitFor(
        () => {
          expect(screen.getByTestId("login-error-message")).toBeInTheDocument();
          expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    }, 15000);

    it("should display loading state during login process", async () => {
      let resolveLogin: (value: LoginResult) => void;
      const loginPromise = new Promise<LoginResult>((resolve) => {
        resolveLogin = resolve;
      });

      (FetchHttpClient.prototype.post as jest.Mock).mockReturnValueOnce(loginPromise);

      renderLoginPage();

      await act(async () => {
        await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "password123");
      });

      await act(async () => {
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
      });

      await waitFor(
        () => {
          const submitButton = screen.getByTestId("login-submit-button");
          expect(submitButton).toBeDisabled();
          expect(submitButton).toHaveTextContent(/processing/i);
        },
        { timeout: 10000 }
      );

      // Cleanup: Resolve the promise to avoid hanging test
      await act(async () => {
        resolveLogin!({
          token: "fake-token",
          user: { id: "1", email: "test@example.com", name: "Test User" },
        });
      });
    }, 15000);

    it("should display success state after successful login", async () => {
      const mockLoginResult: LoginResult = {
        token: "fake-token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
      };

      (FetchHttpClient.prototype.post as jest.Mock).mockResolvedValueOnce(mockLoginResult);

      renderLoginPage();

      await act(async () => {
        await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "password123");
      });

      await act(async () => {
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
      });

      await waitFor(
        () => {
          expect(screen.getByTestId("login-success-message")).toBeInTheDocument();
          expect(screen.getByText(/login successful/i)).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    }, 15000);
  });

  describe("Form State Management", () => {
    it("should reflect user input in form fields", async () => {
      renderLoginPage();

      const emailInput = screen.getByTestId("login-email-input") as HTMLInputElement;
      const passwordInput = screen.getByTestId("login-password-input") as HTMLInputElement;

      await act(async () => {
        await userEvent.type(emailInput, "user@example.com");
        await userEvent.type(passwordInput, "mypassword");
      });

      expect(emailInput.value).toBe("user@example.com");
      expect(passwordInput.value).toBe("mypassword");
    });

    it("should display navigation link to registration", () => {
      renderLoginPage();

      expect(screen.getByText(/don't have an account\? sign up here/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /don't have an account\? sign up here/i })).toHaveAttribute(
        "href",
        "/register"
      );
    });
  });
});
