# Standard Operating Procedure: Frontend Component Tests

**Status:** Mandatory
**Version:** 1.1
**Date:** {{CURRENT_DATE}}

**NON-NEGOTIABLE STANDARD:** Adherence to this SOP is mandatory for all Frontend Component Tests. Deviations are not permitted without explicit architectural review and approval.

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Definitions](#3-definitions)
4. [Key Principles (Non-Negotiable)](#4-key-principles-non-negotiable)
5. [Page Object Pattern (Mandatory)](#5-page-object-pattern-mandatory)
6. [Test Structure (Arrange-Act-Assert)](#6-test-structure-arrange-act-assert)
7. [What NOT to Test (Implementation Details)](#7-what-not-to-test-implementation-details)
8. [Modern Test Pyramid Alignment](#8-modern-test-pyramid-alignment)
9. [Test Categories and Examples](#9-test-categories-and-examples)
10. [Forbidden Test Types](#10-forbidden-test-types)
11. [Tools and Setup](#11-tools-and-setup)

## 1. Purpose

This SOP defines the standards for writing Frontend Component Tests within the Digital Kudos Wall frontend application. The primary goal is to ensure **fast developer feedback** and **granular error detection** by testing component behavior, not implementation details.

## 2. Scope

This SOP applies to all component tests written for React components in the frontend application, focusing on component isolation and behavioral testing.

## 3. Definitions

- **Component Test:** A test that verifies the behavior of a React component in isolation, using Test Doubles for external dependencies and focusing on component responsibilities rather than implementation details.
- **Component Behavior:** Observable actions and state changes that a component exhibits in response to props, user interactions, or internal state changes.
- **Implementation Details:** Internal structure, HTML attributes, CSS classes, or framework-specific details that could change without affecting component behavior.

## 4. Key Principles (Non-Negotiable)

### 4.1. Behavior-Driven Testing

- **Standard:** Tests MUST verify the observable behavior of the component from the perspective of a user or parent component.
- **Focus:** Test cases should cover component states, user interactions, and communication with parent components.
- **Rationale:** Following Modern Test Pyramid principles to provide fast developer feedback and avoid brittle tests.

**✅ CORRECT Examples (Behavior-Focused):**

```typescript
// Component State Rendering
✅ "should render registration mode correctly"
✅ "should render login mode correctly"
✅ "should display error states"
✅ "should display loading states"

// User Interactions
✅ "should handle form submission"
✅ "should handle field changes"

// Component Communication
✅ "should prevent submission when disabled"
✅ "should handle state transitions correctly"
✅ "should render with controlled form values"
```

**❌ INCORRECT Examples (Implementation Details):**

```typescript
// HTML/Accessibility Implementation
❌ "should have proper input types"
❌ "should have required attributes on form fields"
❌ "should have correct CSS classes"
❌ "should have proper ARIA labels"

// Props Interface Edge Cases
❌ "should handle missing name prop gracefully"
❌ "should work with minimal required props"
❌ "should not require name field in login mode"

// Framework-Specific Details
❌ "should call useEffect on mount"
❌ "should have correct component structure"
```

### 4.2. Component Isolation Strategy

- **Standard A (Test Doubles for Dependencies):** Use Jest mocks for all external dependencies including:
  - Parent component callbacks (`onSubmit`, `onChange`)
  - External services or APIs
  - React hooks that perform side effects
- **Standard B (Real React Rendering):** Use real React rendering with `@testing-library/react` for:
  - Component rendering and DOM interaction
  - User event simulation
  - State management within the component

**Example:**

```typescript
const mockProps = {
  name: { value: "", onChange: jest.fn() },
  email: { value: "", onChange: jest.fn() },
  password: { value: "", onChange: jest.fn() },
  onSubmit: jest.fn(),
  isLoading: false,
  error: null,
};
```

### 4.3. Decoupling from Structure, Coupling to Behavior

- **Standard:** Tests MUST interact with components through user-facing interfaces (labels, roles, text content) NOT through:
  - CSS selectors or classes
  - Data-testid attributes (use sparingly, only when necessary)
  - Component internal methods or state
  - HTML element types or attributes

**✅ CORRECT Approach:**

```typescript
expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
```

**❌ INCORRECT Approach:**

```typescript
expect(screen.getByTestId("email-input")).toHaveAttribute("type", "email");
expect(container.querySelector(".form-field")).toBeRequired();
expect(wrapper.find("input[type='email']")).toHaveLength(1);
```

### 4.4. Speed and Determinism

- **Standard:** Component Tests MUST be fast (< 2 seconds total execution) and deterministic.
- **Rationale:** Fast tests provide immediate feedback during development, supporting rapid iteration.
- **Implementation:** Achieved by avoiding real API calls, timers, or external dependencies.

## 5. Page Object Pattern (Mandatory)

To further enhance test maintainability and adhere to Clean Architecture principles, the **Page Object Pattern** is a **mandatory** standard for all component tests.

### 5.1. Rationale

The Page Object Pattern encapsulates the component's UI and interactions into a separate class, providing several key benefits:

- **DRY (Don't Repeat Yourself):** Selectors and interaction logic are defined once and reused across multiple tests.
- **Maintainability:** When the component's UI structure changes, updates are only needed in one place—the Page Object—not in every test file.
- **Readability:** Tests become more declarative and focused on behavior, reading like user scenarios rather than a series of DOM queries.
- **Clean Architecture:** It separates the "what" (the test's intent) from the "how" (the implementation details of interacting with the component).

### 5.2. Structure

The Page Object infrastructure MUST be organized as follows within the `src/__tests__/page-objects/` directory:

- **`base.page.ts`:** An abstract base class containing common query helpers and utilities for interacting with `@testing-library/react`.
- **`[component-name].page.ts`:** A dedicated Page Object class for the component under test. It inherits from `BasePage` and exposes high-level methods for interactions and assertions.
- **`page.factory.ts`:** A factory class responsible for creating instances of Page Objects.
- **`index.ts`:** An index file that exports all Page Object classes for clean imports.

### 5.3. Implementation Example

A Page Object should expose high-level, behavior-oriented methods.

**Example: `registration-form.page.ts`**

```typescript
export class RegistrationFormPage extends BasePage {
  // Element getters
  get nameField(): HTMLElement {
    /* ... */
  }
  get submitButton(): HTMLElement {
    /* ... */
  }

  // High-level actions
  fillRegistrationForm(name: string, email: string, password: string): void {
    this.fillNameField(name);
    this.fillEmailField(email);
    this.fillPasswordField(password);
  }

  submitForm(): void {
    fireEvent.submit(this.form);
  }

  // Compound actions
  performRegistration(name: string, email: string, password: string): void {
    this.fillRegistrationForm(name, email, password);
    this.submitForm();
  }

  // State verification
  shouldShowError(expectedError: string): void {
    expect(this.hasError()).toBe(true);
    expect(this.getErrorText()).toMatch(new RegExp(expectedError, "i"));
  }

  shouldBeInLoadingState(): void {
    expect(this.isSubmitButtonDisabled()).toBe(true);
  }
}
```

### 5.4. Refactoring Tests to Use Page Objects

Tests MUST be refactored to use the Page Object instead of direct `@testing-library/react` calls for component interactions.

**❌ INCORRECT (Before Page Objects):**

```typescript
test("should handle form submission", () => {
  const mockOnSubmit = jest.fn();
  renderComponent({ onSubmit: mockOnSubmit });

  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John" } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@doe.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password" } });
  fireEvent.click(screen.getByRole("button"));

  expect(mockOnSubmit).toHaveBeenCalledTimes(1);
});
```

**✅ CORRECT (With Page Objects):**

```typescript
test("should handle form submission", () => {
  const mockOnSubmit = jest.fn();
  const { page } = renderComponent({ onSubmit: mockOnSubmit });

  page.performRegistration("John Doe", "john@example.com", "password123");

  expect(mockOnSubmit).toHaveBeenCalledTimes(1);
});
```

**Canonical Example:** For a complete implementation, refer to `RegistrationForm.component.test.tsx` and its corresponding Page Object in `src/__tests__/page-objects/registration-form.page.ts`.

## 6. Test Structure (Arrange-Act-Assert)

- **Standard:** All tests MUST follow the Arrange-Act-Assert (AAA) pattern with clear test organization.

```typescript
describe("Component Test: ComponentName", () => {
  // Test doubles setup
  const mockProps = {
    /* ... */
  };
  const renderComponent = (props = {}) => render(<ComponentName {...mockProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks for test isolation
  });

  describe("Component State Rendering", () => {
    test("should render default state correctly", () => {
      // Arrange
      renderComponent();

      // Act (implicit - component renders)

      // Assert
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    test("should handle user action", () => {
      // Arrange
      const mockCallback = jest.fn();
      renderComponent({ onAction: mockCallback });

      // Act
      fireEvent.click(screen.getByRole("button"));

      // Assert
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Component Communication", () => {
    test("should communicate with parent correctly", () => {
      // Arrange, Act, Assert pattern
    });
  });
});
```

## 7. What NOT to Test (Implementation Details)

### 7.1. HTML Structure and Attributes

- Input types, required attributes, CSS classes
- **Rationale:** These are implementation details that should be handled by TypeScript, linting, and accessibility tools

### 7.2. Framework-Specific Details

- React lifecycle methods, hooks implementation
- **Rationale:** These are React internals, not component behavior

### 7.3. Props Interface Edge Cases

- Handling missing props, default props behavior
- **Rationale:** TypeScript provides compile-time safety for props interfaces

### 7.4. Styling and Layout

- CSS classes, inline styles, visual positioning
- **Rationale:** Visual testing should be handled by visual regression tools

## 8. Modern Test Pyramid Alignment

This SOP directly implements the Modern Test Pyramid principles:

- **Fast Developer Feedback:** Component tests run in < 2 seconds vs system tests (minutes/hours)
- **Granular Error Detection:** Know exactly which component is broken
- **Reduced Debugging Time:** No need to debug across system boundaries
- **Component Isolation:** Frontend components tested independently of backend

## 9. Test Categories and Examples

### 9.1. Component State Rendering (Test Different Component States)

```typescript
✅ "should render registration mode correctly"
✅ "should render login mode correctly"
✅ "should display error states"
✅ "should display loading states"
```

### 9.2. User Interactions (Test User Actions)

```typescript
✅ "should handle form submission"
✅ "should handle field changes"
✅ "should handle button clicks"
✅ "should handle keyboard navigation"
```

### 9.3. Component Communication (Test Parent-Child Communication)

```typescript
✅ "should prevent submission when disabled"
✅ "should handle state transitions correctly"
✅ "should render with controlled form values"
✅ "should call parent callbacks with correct parameters"
```

## 10. Forbidden Test Types

The following test types are **EXPLICITLY FORBIDDEN** as they violate Modern Test Pyramid principles:

```typescript
❌ "should have proper input types"
❌ "should have required attributes on form fields"
❌ "should have correct CSS classes"
❌ "should not require name field in login mode"
❌ "should handle missing name prop gracefully"
❌ "should work with minimal required props"
❌ "should have proper ARIA labels"
❌ "should match snapshot" (for structural testing)
```

## 11. Tools and Setup

### 11.1. Required Dependencies

- `@testing-library/react` - Component rendering and queries
- `@testing-library/jest-dom` - Custom Jest matchers
- `jest` - Test runner and mocking framework

### 11.2. Prohibited Tools for Component Tests

- `enzyme` - Encourages implementation detail testing
- `react-test-renderer` - Too low-level for behavior testing
- Direct DOM manipulation libraries

## 12. Enforcement

Violation of these standards will result in:

1. Build failures during CI
2. Rejection during code review
3. Mandatory refactoring before merge

These standards are **NON-NEGOTIABLE** to maintain fast developer feedback and prevent regression in test quality.

## 13. Success Metrics

Component tests following this SOP should achieve:

- **Speed:** < 2 seconds total execution time
- **Maintainability:** Tests rarely break during refactoring
- **Clarity:** Test failures immediately indicate component behavior issues
