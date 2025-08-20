import { render } from "@testing-library/react";
import RegistrationForm from "./RegistrationForm";
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
    test("should enable form submission when not loading", () => {
      const { page } = renderComponent();

      expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    test("should reflect field value changes in form state", () => {
      const props = new RegistrationFormPropsBuilder()
        .withName("Initial Name")
        .withEmail("initial@example.com")
        .withPassword("initialpass")
        .build();
      const { page } = renderComponent(props);

      expect(page.getNameFieldValue()).toBe("Initial Name");
      expect(page.getEmailFieldValue()).toBe("initial@example.com");
      expect(page.getPasswordFieldValue()).toBe("initialpass");
    });

    test("should display correct form structure for registration flow", () => {
      const { page } = renderComponent();

      page.shouldShowRegistrationFields();
      expect(page.getSubmitButtonText()).toMatch(/create account/i);
    });

    test("should display correct form structure for login flow", () => {
      const props = new RegistrationFormPropsBuilder().inLoginMode().build();
      const { page } = renderComponent(props);

      page.shouldShowLoginFields();
      expect(page.getSubmitButtonText()).toMatch(/sign in/i);
    });
  });

  describe("Component State Management", () => {
    test("should display disabled state when loading", () => {
      const props = new RegistrationFormPropsBuilder().isLoading().build();
      const { page } = renderComponent(props);

      expect(page.isSubmitButtonDisabled()).toBe(true);
      page.shouldBeInLoadingState();
    });

    test("should display error state when error is present", () => {
      const props = new RegistrationFormPropsBuilder().withError("Registration failed").build();
      const { page } = renderComponent(props);

      page.shouldShowError("Registration failed");
      expect(page.isSubmitButtonDisabled()).toBe(false);
    });

    test("should display controlled form values correctly", () => {
      const props = new RegistrationFormPropsBuilder()
        .withName("John Doe")
        .withEmail("john@example.com")
        .withPassword("password123")
        .build();

      const { page } = renderComponent(props);

      page.shouldDisplayFieldValues("John Doe", "john@example.com", "password123");
    });

    test("should display different states in different modes", () => {
      const registrationProps = new RegistrationFormPropsBuilder().build();
      const loginProps = new RegistrationFormPropsBuilder().inLoginMode().build();

      const { page: registrationPage } = renderComponent(registrationProps);
      const { page: loginPage } = renderComponent(loginProps);

      expect(registrationPage.isInRegistrationMode()).toBe(true);
      expect(loginPage.isInLoginMode()).toBe(true);
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
