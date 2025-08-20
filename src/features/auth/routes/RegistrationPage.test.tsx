import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegistrationPage from "./RegistrationPage";
import { useRegistration } from "../hooks/useRegistration";
import { PageFactory } from "@/__tests__/page-objects";
import { AuthProvider } from "../providers/AuthProvider";

jest.mock("../hooks/useRegistration", () => ({
  useRegistration: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUseRegistration = useRegistration as jest.Mock;

describe("Component Test: RegistrationPage", () => {
  const renderComponent = (initialRoute = "/register") => {
    const { container } = render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <RegistrationPage />
        </AuthProvider>
      </MemoryRouter>
    );
    const page = PageFactory.createRegistrationFormPage(container);
    return { container, page };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Registration State Rendering", () => {
    it("should display registration form in default state", () => {
      mockUseRegistration.mockReturnValue({
        error: null,
        isLoading: false,
        isSuccess: false,
        handleSubmit: jest.fn(),
      });

      const { page } = renderComponent();

      page.shouldShowRegistrationFields();
      expect(page.getSubmitButtonText()).toMatch(/create account/i);
      expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    it("should display error state when registration fails", () => {
      mockUseRegistration.mockReturnValue({
        error: "This email is already in use.",
        isLoading: false,
        isSuccess: false,
        handleSubmit: jest.fn(),
      });

      const { page } = renderComponent();

      page.shouldShowError("This email is already in use.");
      expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    it("should display loading state during registration", () => {
      mockUseRegistration.mockReturnValue({
        error: null,
        isLoading: true,
        isSuccess: false,
        handleSubmit: jest.fn(),
      });

      const { page } = renderComponent();

      page.shouldBeInLoadingState();
      expect(page.isSubmitButtonDisabled()).toBe(true);
    });
  });

  describe("Page State Management", () => {
    it("should display confirmation message when navigated from successful registration", () => {
      mockUseRegistration.mockReturnValue({
        error: null,
        isLoading: false,
        isSuccess: false,
        handleSubmit: jest.fn(),
      });

      const { container } = render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/login",
              state: { justRegistered: true, email: "john@example.com" },
            },
          ]}>
          <AuthProvider>
            <RegistrationPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(container.querySelector('[data-testid="confirmation-message"]')).toBeInTheDocument();
      expect(container.textContent).toContain(
        "Registration successful! A confirmation has been sent to john@example.com"
      );
    });

    it("should display different page titles for registration vs login modes", () => {
      const { container: regContainer } = render(
        <MemoryRouter initialEntries={["/register"]}>
          <AuthProvider>
            <RegistrationPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(regContainer.textContent).toContain("Join Our Team");
      expect(regContainer.textContent).toContain("Create your account to start sharing kudos");

      const { container: loginContainer } = render(
        <MemoryRouter initialEntries={["/login"]}>
          <AuthProvider>
            <RegistrationPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(loginContainer.textContent).toContain("Welcome Back");
      expect(loginContainer.textContent).toContain("Sign in to continue to Digital Kudos Wall");
    });
  });
});
