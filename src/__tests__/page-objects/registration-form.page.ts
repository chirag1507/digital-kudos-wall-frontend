import { fireEvent } from "@testing-library/react";
import { BasePage } from "./base.page";

export interface RegistrationFormState {
  isLoginMode?: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegistrationFormActions {
  onSubmit: () => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export class RegistrationFormPage extends BasePage {
  // Element getters
  get nameField(): HTMLElement {
    return this.getByLabelText(/full name/i);
  }

  get emailField(): HTMLElement {
    return this.getByLabelText(/email address/i);
  }

  get passwordField(): HTMLElement {
    return this.getByLabelText(/password/i);
  }

  get submitButton(): HTMLElement {
    return this.getByRole("button", { name: /create account|sign in|creating account|signing in/i });
  }

  get errorMessage(): HTMLElement | null {
    return this.queryByRole("alert");
  }

  get form(): HTMLElement {
    return this.submitButton.closest("form") as HTMLElement;
  }

  // State verification methods
  isInRegistrationMode(): boolean {
    return this.queryByLabelText(/full name/i) !== null;
  }

  isInLoginMode(): boolean {
    return this.queryByLabelText(/full name/i) === null;
  }

  hasError(): boolean {
    return this.errorMessage !== null;
  }

  getErrorText(): string | null {
    return this.errorMessage?.textContent || null;
  }

  isSubmitButtonDisabled(): boolean {
    return this.submitButton.hasAttribute("disabled");
  }

  getSubmitButtonText(): string {
    return this.submitButton.textContent || "";
  }

  // Field value getters
  getNameFieldValue(): string {
    return (this.nameField as HTMLInputElement).value;
  }

  getEmailFieldValue(): string {
    return (this.emailField as HTMLInputElement).value;
  }

  getPasswordFieldValue(): string {
    return (this.passwordField as HTMLInputElement).value;
  }

  // Actions
  fillNameField(value: string): void {
    fireEvent.change(this.nameField, { target: { value } });
  }

  fillEmailField(value: string): void {
    fireEvent.change(this.emailField, { target: { value } });
  }

  fillPasswordField(value: string): void {
    fireEvent.change(this.passwordField, { target: { value } });
  }

  fillRegistrationForm(name: string, email: string, password: string): void {
    this.fillNameField(name);
    this.fillEmailField(email);
    this.fillPasswordField(password);
  }

  fillLoginForm(email: string, password: string): void {
    this.fillEmailField(email);
    this.fillPasswordField(password);
  }

  clickSubmitButton(): void {
    fireEvent.click(this.submitButton);
  }

  submitForm(): void {
    fireEvent.submit(this.form);
  }

  // Compound actions
  performRegistration(name: string, email: string, password: string): void {
    this.fillRegistrationForm(name, email, password);
    this.submitForm();
  }

  performLogin(email: string, password: string): void {
    this.fillLoginForm(email, password);
    this.submitForm();
  }

  // Verification helpers
  shouldShowRegistrationFields(): void {
    expect(this.isInRegistrationMode()).toBe(true);
  }

  shouldShowLoginFields(): void {
    expect(this.isInLoginMode()).toBe(true);
  }

  shouldShowError(expectedError: string): void {
    expect(this.hasError()).toBe(true);
    expect(this.getErrorText()).toMatch(new RegExp(expectedError, "i"));
  }

  shouldNotShowError(): void {
    expect(this.hasError()).toBe(false);
  }

  shouldBeInLoadingState(): void {
    expect(this.isSubmitButtonDisabled()).toBe(true);
    expect(this.getSubmitButtonText()).toMatch(/creating account|signing in/i);
  }

  shouldDisplayFieldValues(name?: string, email?: string, password?: string): void {
    if (name !== undefined) {
      expect(this.getNameFieldValue()).toBe(name);
    }
    if (email !== undefined) {
      expect(this.getEmailFieldValue()).toBe(email);
    }
    if (password !== undefined) {
      expect(this.getPasswordFieldValue()).toBe(password);
    }
  }
}
