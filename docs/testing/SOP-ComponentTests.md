# Standard Operating Procedure: Frontend Component Tests

**Status:** Mandatory
**Version:** 1.0
**Date:** {{CURRENT_DATE}}

**NON-NEGOTIABLE STANDARD:** Adherence to this SOP is mandatory for all Frontend Component Tests. Deviations are not permitted without explicit architectural review and approval.

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

## 5. Test Structure (Arrange-Act-Assert)

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

## 6. What NOT to Test (Implementation Details)

### 6.1. HTML Structure and Attributes

- Input types, required attributes, CSS classes
- **Rationale:** These are implementation details that should be handled by TypeScript, linting, and accessibility tools

### 6.2. Framework-Specific Details

- React lifecycle methods, hooks implementation
- **Rationale:** These are React internals, not component behavior

### 6.3. Props Interface Edge Cases

- Handling missing props, default props behavior
- **Rationale:** TypeScript provides compile-time safety for props interfaces

### 6.4. Styling and Layout

- CSS classes, inline styles, visual positioning
- **Rationale:** Visual testing should be handled by visual regression tools

## 7. Modern Test Pyramid Alignment

This SOP directly implements the Modern Test Pyramid principles:

- **Fast Developer Feedback:** Component tests run in < 2 seconds vs system tests (minutes/hours)
- **Granular Error Detection:** Know exactly which component is broken
- **Reduced Debugging Time:** No need to debug across system boundaries
- **Component Isolation:** Frontend components tested independently of backend

## 8. Test Categories and Examples

### 8.1. Component State Rendering (Test Different Component States)

```typescript
✅ "should render registration mode correctly"
✅ "should render login mode correctly"
✅ "should display error states"
✅ "should display loading states"
```

### 8.2. User Interactions (Test User Actions)

```typescript
✅ "should handle form submission"
✅ "should handle field changes"
✅ "should handle button clicks"
✅ "should handle keyboard navigation"
```

### 8.3. Component Communication (Test Parent-Child Communication)

```typescript
✅ "should prevent submission when disabled"
✅ "should handle state transitions correctly"
✅ "should render with controlled form values"
✅ "should call parent callbacks with correct parameters"
```

## 9. Forbidden Test Types

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

## 10. Tools and Setup

### 10.1. Required Dependencies

- `@testing-library/react` - Component rendering and queries
- `@testing-library/jest-dom` - Custom Jest matchers
- `jest` - Test runner and mocking framework

### 10.2. Prohibited Tools for Component Tests

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
