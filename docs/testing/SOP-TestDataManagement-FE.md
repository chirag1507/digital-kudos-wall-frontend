# Standard Operating Procedure: Frontend Test Data Management

**Status:** Mandatory
**Version:** 1.0
**Date:** {{CURRENT_DATE}}

**NON-NEGOTIABLE STANDARD:** Adherence to this SOP is mandatory for managing test data in frontend automated tests, particularly for Component Tests. Deviations are not permitted without explicit architectural review and approval.

## 1. Purpose

This SOP defines the standards for creating and managing test data (i.e., component props) for frontend tests. The goal is to ensure our tests are fast, reliable, maintainable, and decoupled from component implementation details.

## 2. Guiding Principles (Non-Negotiable)

### 2.1. Isolate Component Props with Test Data Builders

- **Rule:** For creating the `props` object for a component under test, tests **MUST** use a **Test Data Builder**. Manually creating props objects within test files is forbidden.
- **Rationale:** This decouples tests from the component's `props` interface. If a prop is added, changed, or removed, we only need to update the builder, not every test that uses the component. This makes our test suite significantly more robust and easier to maintain.
- **Location:** Builders MUST be located in the `src/__tests__/builders/` directory.

### 2.2. Ensure Sensible Defaults

- **Rule:** Every Test Data Builder MUST provide sensible, valid default values for all required props. A call to `.build()` with no customizations should produce a valid props object that allows the component to render without errors.
- **Rationale:** This simplifies test setup by ensuring a baseline of valid data, allowing tests to focus only on the data they need to change.

### 2.3. Use the Minimum Necessary Data Customization

- **Rule:** When using a Test Data Builder, tests should only customize the props that are directly relevant to the behavior being tested. All other props should rely on the builder's defaults.
- **Rationale:** This makes the test's intent clearer by highlighting "what's different" for a specific scenario. It avoids cluttering tests with irrelevant data, making them more readable and focused.

## 3. Example of Builder Implementation and Usage

### 3.1. Builder Implementation

A builder should provide a fluent interface for customization.

**Example: `registration-form-props.builder.ts`**

```typescript
export class RegistrationFormPropsBuilder {
  private props: RegistrationFormProps = {
    email: { value: "default@example.com", onChange: jest.fn() },
    password: { value: "DefaultPass123!", onChange: jest.fn() },
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
  };

  withEmail(email: string): this {
    this.props.email.value = email;
    return this;
  }

  isLoading(): this {
    this.props.isLoading = true;
    return this;
  }

  build(): RegistrationFormProps {
    return this.props;
  }
}
```

### 3.2. Test Implementation

Tests should be clean, declarative, and easy to read.

**✅ CORRECT: Using a builder and specifying only the relevant data.**

```typescript
it("should display loading states", () => {
  // Arrange
  const props = new RegistrationFormPropsBuilder().isLoading().build();
  const { page } = renderComponent(props);

  // Assert
  page.shouldBeInLoadingState();
});
```

**❌ FORBIDDEN: Creating data directly and over-specifying.**

```typescript
it("should display loading states", () => {
  // Arrange
  const props = {
    name: { value: "John", onChange: jest.fn() }, // Irrelevant for this test
    email: { value: "test@example.com", onChange: jest.fn() }, // Irrelevant
    password: { value: "password123", onChange: jest.fn() }, // Irrelevant
    onSubmit: jest.fn(), // Irrelevant
    isLoading: true, // This is the only relevant piece of data
    error: null,
  };
  const { page } = renderComponent(props);

  // Assert
  page.shouldBeInLoadingState();
});
```

## 4. Related SOPs

- `SOP-ComponentTests.md`

## 5. Enforcement

Correct application of the Test Data Builder pattern as defined here is critical for maintaining a healthy and scalable test suite. Violations will be addressed during code reviews. These standards are **non-negotiable**.
