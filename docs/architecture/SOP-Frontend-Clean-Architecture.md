# Standard Operating Procedure: Frontend Clean Architecture

**Status:** Mandatory
**Version:** 1.0
**Date:** {{CURRENT_DATE}}

**NON-NEGOTIABLE STANDARD:** Adherence to this SOP is mandatory for all frontend features. Deviations are not permitted without explicit architectural review and approval. This is to ensure a scalable, maintainable, and testable codebase aligned with our long-term vision for micro-frontends and a Product Operating Model.

## 1. Purpose

This SOP defines the standards for implementing a Clean Architecture in the Digital Kudos Wall frontend application. The primary goal is to decouple business logic from the UI framework (React), enabling independent development, testing, and evolution of the core application functionality.

## 2. Scope

This SOP applies to all feature development within the frontend codebase.

## 3. The Four Layers of Frontend Architecture

All frontend code MUST be organized into one of the following four layers. The fundamental rule is the **Dependency Rule**: source code dependencies can only point inwards. Nothing in an inner layer can know anything at all about something in an outer layer.

```
+------------------------------------------------------+
| 4. Frameworks & Drivers (React Components, API Client) |
+------------------------------------------------------+
       ^
       | Dependencies
       v
+------------------------------------------------------+
| 3. Interface Adapters (Custom Hooks)                 |
+------------------------------------------------------+
       ^
       | Dependencies
       v
+------------------------------------------------------+
| 2. Application Business Rules (Use Cases)            |
+------------------------------------------------------+
       ^
       | Dependencies
       v
+------------------------------------------------------+
| 1. Enterprise Business Rules (Entities - Future Use) |
+------------------------------------------------------+
```

### Layer 1: Enterprise Business Rules (Entities)

- **Content:** Core business objects and rules that are application-agnostic. (Note: For many frontend applications, this layer may remain light initially).
- **Location:** `src/domain/`
- **Dependencies:** None.

### Layer 2: Application Business Rules (Use Cases)

- **Standard:** This is the heart of the frontend application. It contains the application-specific orchestration logic. Each use case MUST be implemented as a `class` (also known as an "Interactor") to ensure a clear separation of concerns and explicit dependency injection.
- **Content:**
  - MUST NOT contain any reference to React, hooks, or any UI framework.
  - Orchestrates the flow of data required for a specific user interaction on the frontend.
  - Takes simple data types as input and returns a result.
  - MUST depend on abstractions (interfaces) for any external services (like an `IAuthService`), not on concrete implementations.
- **Location:** `src/features/{feature-name}/application/`
- **Example:**

  ```typescript
  // src/features/auth/application/registerUser.ts
  import { IAuthService, RegistrationData, User } from "../interfaces";

  export class RegisterUserUseCase {
    constructor(private readonly authService: IAuthService) {}

    async execute(payload: RegistrationData): Promise<User> {
      // Application-specific logic lives here. e.g., analytics.track()
      return this.authService.registerUser(payload);
    }
  }
  ```

### Layer 3: Interface Adapters (Custom Hooks)

- **Standard:** This layer acts as the bridge between the application logic (Use Cases) and the UI framework (React).
- **Content:**
  - Custom React Hooks that manage all UI-related state (`useState`, `useReducer`), side effects (`useEffect`), and user event handling.
  - Responsible for instantiating Use Case classes and calling their `execute` methods.
  - Injects concrete service implementations (or other dependencies) into the use cases upon instantiation.
- **Location:** `src/features/{feature-name}/hooks/`
- **Dependencies:** Depends on Use Cases (inward) and React (outward framework).
- **Example:**

  ```typescript
  // src/features/auth/hooks/useRegistration.ts
  import { useState, useMemo } from "react";
  import { RegisterUserUseCase } from "../application/registerUser";
  import { authService } from "../services/authService"; // Concrete Adapter

  export const useRegistration = () => {
    const [error, setError] = useState<string | null>(null);
    // ... other state ...

    // Use `useMemo` to ensure the use case is instantiated only once.
    const registerUserUseCase = useMemo(() => new RegisterUserUseCase(authService), []);

    const handleSubmit = async (data) => {
      await registerUserUseCase.execute(data);
      // ... handle result ...
    };

    return { error, handleSubmit /* ... */ };
  };
  ```

### Layer 4: Frameworks & Drivers (React Components & Services)

- **Standard:** This is the outermost layer, composed of the implementation details.
- **Content:**
  - **React Components:** "Dumb" components that only render UI based on props. They delegate all logic and event handling to the hooks provided to them.
  - **Services:** Concrete implementations of the interfaces required by the Application Layer (e.g., `IAuthService`). Their job is to "adapt" the specific technology (e.g., `fetch` for a REST API, or a GraphQL client) to the needs of the application.
- **Location:**
  - Components: `src/features/{feature-name}/components/` and `src/features/{feature-name}/routes/`
  - Services: `src/features/{feature-name}/services/`
  - Interfaces: `src/features/{feature-name}/interfaces/` (e.g., `IAuthService.ts`)

## 4. Directory Structure (Non-Negotiable)

To enforce this separation, all feature-based modules MUST follow this directory structure:

```
src/
└── features/
    └── {feature-name}/
        ├── application/   // Layer 2: Use Case classes (e.g., RegisterUserUseCase.ts)
        ├── components/    // Layer 4: Dumb React Components
        ├── hooks/         // Layer 3: Custom Hooks (e.g., useRegistration.ts)
        ├── routes/        // Layer 4: Page-level Components
        ├── services/      // Layer 4: Concrete service implementations (e.g., authService.ts)
        └── interfaces/    // The contracts (TypeScript interfaces) for services.
```

## 5. Enforcement

Violation of these standards will result in build failures during CI (where possible) and/or rejection during code review. These standards are non-negotiable to maintain the integrity, scalability, and testability of the frontend architecture.
