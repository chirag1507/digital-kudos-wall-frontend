import { render, screen, fireEvent } from "@testing-library/react";
import RegistrationForm from "../RegistrationForm";

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

  const renderComponent = (props = {}) => render(<RegistrationForm {...mockProps} {...props} />);

  beforeEach(() => {
    // Reset all mocks to ensure test isolation
    jest.clearAllMocks();
  });

  describe("Component State Rendering", () => {
    test("should render registration mode correctly", () => {
      renderComponent();

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    });

    test("should render login mode correctly", () => {
      renderComponent({ isLoginMode: true });

      expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    test("should display error states", () => {
      renderComponent({ error: "Registration failed" });

      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    test("should display loading states", () => {
      renderComponent({ isLoading: true });

      const button = screen.getByRole("button", { name: /creating account/i });
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Creating Account...");
    });
  });

  describe("User Interactions", () => {
    test("should handle form submission", () => {
      const mockOnSubmit = jest.fn();
      renderComponent({ onSubmit: mockOnSubmit });

      const form = screen.getByRole("button").closest("form");
      fireEvent.submit(form!);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("should handle field changes", () => {
      const mockNameChange = jest.fn();
      const mockEmailChange = jest.fn();
      const mockPasswordChange = jest.fn();

      renderComponent({
        name: { value: "", onChange: mockNameChange },
        email: { value: "", onChange: mockEmailChange },
        password: { value: "", onChange: mockPasswordChange },
      });

      const nameField = screen.getByLabelText(/full name/i);
      const emailField = screen.getByLabelText(/email address/i);
      const passwordField = screen.getByLabelText(/password/i);

      fireEvent.change(nameField, { target: { value: "John" } });
      fireEvent.change(emailField, { target: { value: "john@example.com" } });
      fireEvent.change(passwordField, { target: { value: "password123" } });

      // Focus on behavior: callbacks are triggered
      expect(mockNameChange).toHaveBeenCalledTimes(1);
      expect(mockEmailChange).toHaveBeenCalledTimes(1);
      expect(mockPasswordChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Component Communication", () => {
    test("should prevent submission when disabled", () => {
      const mockOnSubmit = jest.fn();
      renderComponent({
        onSubmit: mockOnSubmit,
        isLoading: true,
      });

      const submitButton = screen.getByRole("button");
      expect(submitButton).toBeDisabled();

      fireEvent.click(submitButton);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("should handle state transitions correctly", () => {
      const { rerender } = renderComponent({ error: "Initial error" });

      expect(screen.getByText(/initial error/i)).toBeInTheDocument();

      // Component should react to prop changes
      rerender(<RegistrationForm {...mockProps} error={null} isLoading={true} />);

      expect(screen.queryByText(/initial error/i)).not.toBeInTheDocument();
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("should render with controlled form values", () => {
      const filledProps = {
        name: { value: "John Doe", onChange: jest.fn() },
        email: { value: "john@example.com", onChange: jest.fn() },
        password: { value: "password123", onChange: jest.fn() },
      };

      renderComponent(filledProps);

      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("password123")).toBeInTheDocument();
    });
  });
});
