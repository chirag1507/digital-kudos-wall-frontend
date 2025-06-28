# Standard Operating Procedure: Frontend Sociable Unit Tests

**Status:** Mandatory
**Version:** 1.0
**Date:** {{CURRENT_DATE}}

**NON-NEGOTIABLE STANDARD:** Adherence to this SOP is mandatory for all Frontend Sociable Unit Tests. Deviations are not permitted without explicit architectural review and approval.

## 1. Purpose

This SOP defines the standards for writing Sociable Unit Tests for the frontend application. The goal is to verify the collaboration between different parts of our application logic (hooks, use cases, services) as a single unit, ensuring they work together correctly to produce the state our UI depends on.

## 2. Scope

This SOP applies to all tests for the frontend's application logic layer, specifically targeting custom hooks that orchestrate business logic and interact with services or repositories.

## 3. Definitions

- **Sociable Unit Test:** A test that verifies a "unit" of frontend application logic by allowing it to collaborate with its direct, genuine dependencies (e.g., a use case calling a service) and using Test Doubles **only** for dependencies that cross the application boundary (e.g., a repository making an HTTP call).
- **Unit:** In this context, a "unit" refers to a custom hook and the entire graph of objects it depends on, down to the boundary that communicates with the outside world.

## 4. Key Principles (Non-Negotiable)

### 4.1. Test the Unit, Not the Class

- **Standard:** The test should treat the hook and its collaborators as a single logical component. We test the behavior of this unit, not the individual classes in isolation.
- **Rationale:** This provides higher confidence that the application logic works as a whole, catching integration errors between internal classes that traditional unit tests would miss.

### 4.2. Mock Only at the Boundary

- **Standard:** Test Doubles (mocks) **MUST** only be used at the boundary of the sociable unit. For a frontend application, this is typically the **Repository layer**, which is responsible for I/O (e.g., HTTP requests).
- **Rationale:** This is the core principle. Mocking internal collaborators (like the use case or service) leads to brittle tests that break during refactoring and fails to test the actual integration. By using real collaborators, we verify their interactions are correct.

### 4.3. Drive Tests via the Public Interface

- **Standard:** Tests MUST be driven by calling the public interface of the hook (e.g., the `handleSubmit` function it returns) and asserting on its observable output (e.g., the `isLoading`, `isSuccess`, and `error` states it returns).
- **Rationale:** This ensures tests are behavior-driven and decoupled from the internal implementation details of the hook or its collaborators.

### 4.4. Test in a Headless Environment

- **Standard:** Tests for hooks MUST use the `renderHook` utility from `@testing-library/react`. They MUST NOT render any actual UI components.
- **Rationale:** This ensures the tests are extremely fast and focused solely on the application logic, not on the UI's reaction to it (which is the job of a Feature Test).

## 5. Test Structure (Arrange-Act-Assert)

- **Standard:** All tests MUST follow the Arrange-Act-Assert (AAA) pattern.

### Example: `useRegistration.test.ts`

```typescript
import { renderHook, act } from "@testing-library/react";
import { useRegistration } from "../useRegistration";
import { RegisterUserUseCase } from "../../application/RegisterUserUseCase";
import { AuthServiceAdapter } from "../../services/AuthServiceAdapter";
import { UserRepository } from "../../interfaces/UserRepository";
import { User } from "../../types/User";

// ARRANGE:
// 1. Mock the repository (the true boundary)
const mockUserRepository: jest.Mocked<UserRepository> = {
  register: jest.fn(),
};

// 2. Use REAL collaborators for the internal application logic
const authService = new AuthServiceAdapter(mockUserRepository);
const registerUserUseCase = new RegisterUserUseCase(authService);

describe("Sociable Unit Test: useRegistration Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful registration", async () => {
    // Arrange: Configure the mock's response
    const mockUser: User = { id: "user-123", name: "John Doe", email: "john@example.com" };
    mockUserRepository.register.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useRegistration({ registerUserUseCase }));

    // ACT: Call the hook's public function
    await act(async () => {
      await result.current.handleSubmit({ name: "John", email: "a@b.com", password: "p" });
    });

    // ASSERT: Verify the hook's final state and the mock's interaction
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockUserRepository.register).toHaveBeenCalledTimes(1);
  });
});
```

## 6. Related SOPs

- `SOP-ComponentTests.md`
- `SOP-TestDataManagement-FE.md`

## 7. Enforcement

Adherence to the Sociable Unit Test pattern is critical for building a robust and maintainable test suite that provides fast, reliable feedback. Violations will be addressed during code review and may result in build failures. These standards are **non-negotiable**.
