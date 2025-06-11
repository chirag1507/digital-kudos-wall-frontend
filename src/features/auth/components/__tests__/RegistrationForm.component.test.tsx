import { render } from "@testing-library/react";
import RegistrationForm from "../RegistrationForm";
import { PageFactory } from "@/__tests__/page-objects";
import { RegistrationFormPropsBuilder } from "@/__tests__/builders/registration-form-props.builder";

describe("Component Test: RegistrationForm", () => {
  const renderComponent = (props = {}) => {
    const finalProps = { ...new RegistrationFormPropsBuilder().build(), ...props };
    const { container } = render(<RegistrationForm {...finalProps} />);
    const page = PageFactory.createRegistrationFormPage(container);
    return { container, page, props: finalProps };
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
      const props = new RegistrationFormPropsBuilder().inLoginMode().build();
      const { page } = renderComponent(props);

      page.shouldShowLoginFields();
      expect(page.getSubmitButtonText()).toMatch(/sign in/i);
    });

    test("should display error states", () => {
      const props = new RegistrationFormPropsBuilder().withError("Registration failed").build();
      const { page } = renderComponent(props);

      page.shouldShowError("Registration failed");
    });

    test("should display loading states", () => {
      const props = new RegistrationFormPropsBuilder().isLoading().build();
      const { page } = renderComponent(props);

      page.shouldBeInLoadingState();
    });
  });

  describe("User Interactions", () => {
    test("should handle form submission", () => {
      const mockOnSubmit = jest.fn();
      const props = new RegistrationFormPropsBuilder().withOnSubmit(mockOnSubmit).build();
      const { page } = renderComponent(props);

      page.submitForm();

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("should handle field changes", () => {
      const mockNameChange = jest.fn();
      const mockEmailChange = jest.fn();
      const mockPasswordChange = jest.fn();

      const props = new RegistrationFormPropsBuilder()
        .withName("", mockNameChange)
        .withEmail("", mockEmailChange)
        .withPassword("", mockPasswordChange)
        .build();
      const { page } = renderComponent(props);

      page.fillNameField("John");
      page.fillEmailField("john@example.com");
      page.fillPasswordField("password123");

      expect(mockNameChange).toHaveBeenCalledTimes(1);
      expect(mockEmailChange).toHaveBeenCalledTimes(1);
      expect(mockPasswordChange).toHaveBeenCalledTimes(1);
    });

    test("should handle complete registration flow", () => {
      const mockOnSubmit = jest.fn();
      const props = new RegistrationFormPropsBuilder().withOnSubmit(mockOnSubmit).build();
      const { page } = renderComponent(props);

      page.performRegistration("John Doe", "john@example.com", "password123");

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("should handle complete login flow", () => {
      const mockOnSubmit = jest.fn();
      const props = new RegistrationFormPropsBuilder().inLoginMode().withOnSubmit(mockOnSubmit).build();
      const { page } = renderComponent(props);

      page.performLogin("john@example.com", "password123");

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Component Communication", () => {
    test("should prevent submission when disabled", () => {
      const mockOnSubmit = jest.fn();
      const props = new RegistrationFormPropsBuilder().isLoading().withOnSubmit(mockOnSubmit).build();
      const { page } = renderComponent(props);

      expect(page.isSubmitButtonDisabled()).toBe(true);
      page.clickSubmitButton();

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("should handle state transitions correctly", () => {
      const initialProps = new RegistrationFormPropsBuilder().withError("Initial error").build();
      const { page, container } = renderComponent(initialProps);

      page.shouldShowError("Initial error");

      const finalProps = new RegistrationFormPropsBuilder().isLoading().build();
      render(<RegistrationForm {...finalProps} />, { container });

      page.shouldNotShowError();
      page.shouldBeInLoadingState();
    });

    test("should render with controlled form values", () => {
      const props = new RegistrationFormPropsBuilder()
        .withName("John Doe")
        .withEmail("john@example.com")
        .withPassword("password123")
        .build();

      const { page } = renderComponent(props);

      page.shouldDisplayFieldValues("John Doe", "john@example.com", "password123");
    });
  });

  describe("Page Object Validation", () => {
    test("should correctly identify form modes", () => {
      const { page: registrationPage } = renderComponent(new RegistrationFormPropsBuilder().build());
      const { page: loginPage } = renderComponent(new RegistrationFormPropsBuilder().inLoginMode().build());

      expect(registrationPage.isInRegistrationMode()).toBe(true);
      expect(registrationPage.isInLoginMode()).toBe(false);

      expect(loginPage.isInRegistrationMode()).toBe(false);
      expect(loginPage.isInLoginMode()).toBe(true);
    });

    test("should provide accurate field values", () => {
      const props = new RegistrationFormPropsBuilder()
        .withName("Test User")
        .withEmail("test@example.com")
        .withPassword("testpass")
        .build();
      const { page } = renderComponent(props);

      expect(page.getNameFieldValue()).toBe("Test User");
      expect(page.getEmailFieldValue()).toBe("test@example.com");
      expect(page.getPasswordFieldValue()).toBe("testpass");
    });
  });
});
