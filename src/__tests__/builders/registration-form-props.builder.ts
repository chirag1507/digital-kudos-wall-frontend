/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: The props interface is defined here because it is not exported from the component.
// This is acceptable for a test data builder as it isolates testing concerns.
export interface RegistrationFormProps {
  name?: {
    value: string;
    onChange: (e: any) => void;
  };
  email: {
    value: string;
    onChange: (e: any) => void;
  };
  password: {
    value: string;
    onChange: (e: any) => void;
  };
  onSubmit: (e: any) => void;
  isLoading: boolean;
  error: string | null;
  isLoginMode?: boolean;
}

type BuilderProps = Omit<RegistrationFormProps, "name"> & {
  name?: RegistrationFormProps["name"];
};

export class RegistrationFormPropsBuilder {
  private props: BuilderProps = {
    email: {
      value: "test@example.com",
      onChange: jest.fn(),
    },
    password: {
      value: "ValidPassword123!",
      onChange: jest.fn(),
    },
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
    isLoginMode: false,
  };

  withName(value: string, onChange: jest.Mock = jest.fn()): this {
    this.props.name = { value, onChange };
    return this;
  }

  withEmail(value: string, onChange: jest.Mock = jest.fn()): this {
    this.props.email = { value, onChange };
    return this;
  }

  withPassword(value: string, onChange: jest.Mock = jest.fn()): this {
    this.props.password = { value, onChange };
    return this;
  }

  withOnSubmit(handler: jest.Mock): this {
    this.props.onSubmit = handler;
    return this;
  }

  inLoginMode(): this {
    this.props.isLoginMode = true;
    return this;
  }

  isLoading(): this {
    this.props.isLoading = true;
    return this;
  }

  withError(message: string): this {
    this.props.error = message;
    return this;
  }

  build(): RegistrationFormProps {
    if (this.props.isLoginMode) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { name, ...loginProps } = this.props;
      return loginProps;
    }

    if (!this.props.name) {
      this.withName("John Doe");
    }

    return this.props as RegistrationFormProps;
  }
}
