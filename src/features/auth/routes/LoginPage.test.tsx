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

describe("LoginPage", () => {
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

  it("should render login form", () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("should show error message on invalid credentials", async () => {
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
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  }, 15000);

  it("should navigate to kudos wall on successful login", async () => {
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
        expect(mockNavigate).toHaveBeenCalledWith("/kudos");
      },
      { timeout: 10000 }
    );
  }, 15000);

  it("should disable submit button while processing", async () => {
    const mockLoginResult: LoginResult = {
      token: "fake-token",
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      },
    };

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
        expect(screen.getByRole("button", { name: /processing/i })).toBeDisabled();
      },
      { timeout: 10000 }
    );

    await act(async () => {
      resolveLogin!(mockLoginResult);
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/kudos");
      },
      { timeout: 10000 }
    );
  }, 15000);
});
