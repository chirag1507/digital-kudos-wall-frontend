# SOP: Contract Testing (Consumer)

This document outlines the **non-negotiable** principles and practices for writing contract tests in the Digital Kudos Wall project. As the consumer, we are responsible for clearly and accurately defining the expectations we have of our providers.

### Guiding Principles

- **Define, Don't Assume**: We must explicitly define every part of the API responses we rely on. The contract is our specification. If a field is not in the contract, there is no guarantee it will exist.
- **Fast, Local Feedback**: Contract tests run as part of our local test suite, providing immediate feedback that our API client code works with the expectations we have defined.
- **Drive the Integration**: We drive the integration. By publishing a new contract, we are signaling a new requirement to the provider. The automated CI/CD process ensures the provider is immediately notified of this change.

### The Automated Contract Testing Workflow

1.  **Write a Contract Test**: For any code that communicates with a provider (e.g., `UserRepositoryImpl`), a corresponding contract test **must** be created in the `__tests__` directory.
2.  **Define Expectations**: Using the Pact DSL, we define the interaction. This includes:
    - `state`: The provider state required for the test (e.g., "a user with this email does not exist").
    - `uponReceiving`: A clear description of the test case.
    - `withRequest`: The exact HTTP request our client will make.
    - `willRespondWith`: The HTTP response we expect, using `Matchers` (e.g., `like`, `eachLike`) to define the structure and type of the body, not just exact values.
3.  **Generate the Contract**: Running the tests locally (`npm run test:contract`) generates a `pact.json` file in the `/pacts` directory. This is the contract.
4.  **Automated Publication**: When a change is pushed to the `main` branch, the `commit-stage.yml` workflow automatically runs the `publish:pacts` script. This script uploads the new contract to the central Pact Broker, versioned with the commit SHA and tagged with `main`. This publication is what triggers the provider's verification process.

### Non-Negotiable Rules for Consumer Contract Tests

1.  **A Contract is Mandatory**: Every API client that communicates with a provider **must** be covered by a contract test. There are no exceptions.
2.  **Contracts Live with the Code**: Contract tests are unit tests for your API client code. They live alongside the code they test and are maintained by the same team.
3.  **Be Specific in What You Need, Flexible in What You Get**: Use matchers (`like`, `eachLike`) for response values. This ensures the provider must return the correct _type_ and _shape_ of data, but allows the actual values to change without breaking the contract. Do not assert on values you can't control (e.g., generated IDs, dates).
4.  **Do Not Commit Pact Files**: The `/pacts` directory is a build artifact directory. It **must** be included in the `.gitignore` file and **must not** be committed to the repository.
5.  **Test Before You Push**: Developers **must** run `npm run test:contract` locally to ensure their changes correctly generate a pact file before pushing their code.
6.  **Communicate Breaking Changes**: While the pipeline provides the technical feedback, a contract change that will break the provider **should** be communicated to the provider team as a professional courtesy. The pipeline is the safety net, not a substitute for collaboration.
