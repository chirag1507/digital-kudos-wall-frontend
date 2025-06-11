import { render } from "@testing-library/react";
import RegistrationForm from "../RegistrationForm";
import { PageFactory } from "@/__tests__/page-objects";

describe("Component Test: RegistrationForm", () => {
  // Test doubles (mocks) - isolating from external dependencies
  const mockProps = {
    name: {
      value: "",
      onChange: jest.fn(),
    },
    email: {
      value: "",
      onChange: jest.fn(),
    },
    password: {
      value: "",
      onChange: jest.fn(),
    },
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
  };

  const renderComponent = (props = {}) => {
    const { container } = render(<RegistrationForm {...mockProps} {...props} />);
    const page = PageFactory.createRegistrationFormPage(container);
    return { container, page };
  };

  beforeEach(() => {
    // Reset all mocks to ensure test isolation
    jest.clearAllMocks();
  });

  describe("Component State Rendering", () => {
    test("should render registration mode correctly", () => {
      const { page } = renderComponent();

      page.shouldShowRegistrationFields();
      expect(page.getSubmitButtonText()).toMatch(/create account/i);
    });

    test("should render login mode correctly", () => {
      const { page } = renderComponent({ isLoginMode: true });

      page.shouldShowLoginFields();
      expect(page.getSubmitButtonText()).toMatch(/sign in/i);
    });

    test("should display error states", () => {
      const { page } = renderComponent({ error: "Registration failed" });

      page.shouldShowError("Registration failed");
    });

    test("should display loading states", () => {
      const { page } = renderComponent({ isLoading: true });

      page.shouldBeInLoadingState();
    });
  });

  describe("User Interactions", () => {
    test("should handle form submission", () => {
      const mockOnSubmit = jest.fn();
      const { page } = renderComponent({ onSubmit: mockOnSubmit });

      page.submitForm();

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("should handle field changes", () => {
      const mockNameChange = jest.fn();
      const mockEmailChange = jest.fn();
      const mockPasswordChange = jest.fn();

      const { page } = renderComponent({
        name: { value: "", onChange: mockNameChange },
        email: { value: "", onChange: mockEmailChange },
        password: { value: "", onChange: mockPasswordChange },
      });

      page.fillNameField("John");
      page.fillEmailField("john@example.com");
      page.fillPasswordField("password123");

      // Focus on behavior: callbacks are triggered
      expect(mockNameChange).toHaveBeenCalledTimes(1);
      expect(mockEmailChange).toHaveBeenCalledTimes(1);
      expect(mockPasswordChange).toHaveBeenCalledTimes(1);
    });

    test("should handle complete registration flow", () => {
      const mockOnSubmit = jest.fn();
      const { page } = renderComponent({ onSubmit: mockOnSubmit });

      page.performRegistration("John Doe", "john@example.com", "password123");

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("should handle complete login flow", () => {
      const mockOnSubmit = jest.fn();
      const { page } = renderComponent({
        isLoginMode: true,
        onSubmit: mockOnSubmit,
      });

      page.performLogin("john@example.com", "password123");

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Component Communication", () => {
    test("should prevent submission when disabled", () => {
      const mockOnSubmit = jest.fn();
      const { page } = renderComponent({
        onSubmit: mockOnSubmit,
        isLoading: true,
      });

      expect(page.isSubmitButtonDisabled()).toBe(true);
      page.clickSubmitButton();

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("should handle state transitions correctly", () => {
      const { page, container } = renderComponent({ error: "Initial error" });

      page.shouldShowError("Initial error");

      // Re-render with new props
      render(<RegistrationForm {...mockProps} error={null} isLoading={true} />, { container });

      page.shouldNotShowError();
      page.shouldBeInLoadingState();
    });

    test("should render with controlled form values", () => {
      const filledProps = {
        name: { value: "John Doe", onChange: jest.fn() },
        email: { value: "john@example.com", onChange: jest.fn() },
        password: { value: "password123", onChange: jest.fn() },
      };

      const { page } = renderComponent(filledProps);

      page.shouldDisplayFieldValues("John Doe", "john@example.com", "password123");
    });
  });

  describe("Page Object Validation", () => {
    test("should correctly identify form modes", () => {
      const { page: registrationPage } = renderComponent();
      const { page: loginPage } = renderComponent({ isLoginMode: true });

      expect(registrationPage.isInRegistrationMode()).toBe(true);
      expect(registrationPage.isInLoginMode()).toBe(false);

      expect(loginPage.isInRegistrationMode()).toBe(false);
      expect(loginPage.isInLoginMode()).toBe(true);
    });

    test("should provide accurate field values", () => {
      const { page } = renderComponent({
        name: { value: "Test User", onChange: jest.fn() },
        email: { value: "test@example.com", onChange: jest.fn() },
        password: { value: "testpass", onChange: jest.fn() },
      });

      expect(page.getNameFieldValue()).toBe("Test User");
      expect(page.getEmailFieldValue()).toBe("test@example.com");
      expect(page.getPasswordFieldValue()).toBe("testpass");
    });
  });
});
