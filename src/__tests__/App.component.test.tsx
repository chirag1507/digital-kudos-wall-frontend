import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";

// Mock the router to avoid double router issue
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderApp = (initialRoute: string = "/") => {
  window.history.pushState({}, "", initialRoute);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("Component Test: App", () => {
  test("should render main application layout", () => {
    renderApp();

    // Test component structure
    expect(screen.getByRole("banner")).toBeInTheDocument(); // AppBar
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content area
  });

  test("should render application title", () => {
    renderApp();

    expect(screen.getByText("Digital Kudos Wall Platform")).toBeInTheDocument();
  });

  test("should render navigation buttons", () => {
    renderApp();

    expect(screen.getByRole("link", { name: /kudos wall/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });

  test("should render registration page by default", () => {
    renderApp("/");

    // Test that the default route renders RegistrationPage content
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  test("should render login page when navigating to /login", () => {
    renderApp("/login");

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("should render kudos wall page when navigating to /kudos", async () => {
    renderApp("/kudos");

    // First verify loading state
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for loading to finish and content to appear
    await waitFor(
      () => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Verify page heading
    expect(screen.getByRole("heading", { name: /kudos wall/i, level: 1 })).toBeInTheDocument();

    // Verify kudos cards are rendered with specific content
    expect(screen.getByText("Outstanding work on the Q1 campaign!")).toBeInTheDocument();
    expect(screen.getByText("Incredible job debugging the production issue!")).toBeInTheDocument();
    expect(screen.getByText("Phenomenal work closing the enterprise deal!")).toBeInTheDocument();
  });
});
