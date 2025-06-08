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

- **Standard:** This is the heart of the frontend application. It contains the application-specific logic. Each file in this layer represents a single, specific use case (e.g., `registerUser.ts`).
- **Content:**
  - Plain TypeScript functions or classes.
  - MUST NOT contain any reference to React, hooks, or any UI framework.
  - Orchestrates the flow of data between the UI and the infrastructure services.
  - Takes simple data types as input and returns a result.
  - Depends on abstractions (interfaces) for services, not concrete implementations.
- **Location:** `src/features/{feature-name}/application/`
- **Example:**

  ```typescript
  // src/features/auth/application/registerUser.ts
  import { IAuthService } from "../services/IAuthService";
  import { RegistrationData } from "../domain/types"; // Or simple types

  export const makeRegisterUser = (authService: IAuthS/ervice) => {
    return async (data: RegistrationData) => {
      // Logic for registration, validation, etc.
      return await authService.register(data);
    };
  };
  ```

### Layer 3: Interface Adapters (Custom Hooks)

- **Standard:** This layer acts as the bridge between the application logic (Use Cases) and the UI framework (React).
- **Content:**
  - Custom React Hooks (e.g., `useRegistration.ts`).
  - Manages component state (`useState`, `useReducer`), side effects (`useEffect`), and user interactions.
  - Instantiates and calls the application Use Cases.
  - Injects concrete service implementations into the use cases.
  - Formats data for presentation to the UI.
- **Location:** `src/features/{feature-name}/hooks/`
- **Dependencies:** Depends on Use Cases (inward) and React (outward framework).
- **Example:**

  ```typescript
  // src/features/auth/hooks/useRegistration.ts
  import { useState } from "react";
  import { makeRegisterUser } from "../application/registerUser";
  import { authService } from "../services/authService"; // Concrete implementation

  const registerUser = makeRegisterUser(authService);

  export const useRegistration = () => {
    // State management...
    const handleSubmit = async (data) => {
      // call registerUser(data)...
    };
    return {
      /* state, handlers */
    };
  };
  ```

### Layer 4: Frameworks & Drivers (React Components & Services)

- **Standard:** This is the outermost layer, composed of the implementation details.
- **Content:**
  - **React Components:** "Dumb" components that receive props and render UI. They delegate all logic to the hooks. They should contain minimal logic, primarily for rendering.
  - **Services:** Concrete implementations of infrastructure concerns. This includes API clients (`apiClient.ts`), analytics services, etc. They implement the interfaces required by the Application Layer.
- **Location:**
  - Components: `src/features/{feature-name}/components/` and `src/features/{feature-name}/routes/`
  - Services: `src/features/{feature-name}/services/` (for feature-specific services) or `src/services/` (for shared services).

## 4. Directory Structure (Non-Negotiable)

To enforce this separation, all feature-based modules MUST follow this directory structure:

```
src/
└── features/
    └── {feature-name}/
        ├── application/   // Layer 2: Use Cases (e.g., registerUser.ts)
        ├── components/    // Layer 4: Dumb React Components
        ├── hooks/         // Layer 3: Custom Hooks (e.g., useRegistration.ts)
        ├── routes/        // Layer 4: Page-level Components
        └── services/      // Layer 4: Concrete service implementations
```

## 5. Enforcement

Violation of these standards will result in build failures during CI (where possible) and/or rejection during code review. These standards are non-negotiable to maintain the integrity, scalability, and testability of the frontend architecture.
