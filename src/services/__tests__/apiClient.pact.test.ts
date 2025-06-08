import { Pact, Matchers } from "@pact-foundation/pact";
import path from "path";
import fetch from "cross-fetch";

const { like } = Matchers;

// Make fetch available globally for the test
global.fetch = fetch;

const mockProvider = new Pact({
  consumer: "DigitalKudosWallFrontend",
  provider: "DigitalKudosWallBackend",
  port: 1234,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "src", "__tests__", "pacts"),
  logLevel: "info",
});

// Create a test version of the API client that uses the mock server
const createTestApiClient = (baseUrl: string) => ({
  registerUser: async (payload: { email: string; password: string }) => {
    const response = await fetch(`${baseUrl}/api/v1/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to register user");
    }

    return response.json();
  },
});

describe("API Client - User Registration Contract", () => {
  beforeAll(() => mockProvider.setup());
  afterAll(() => mockProvider.finalize());

  describe("when registering a new user", () => {
    beforeEach(() => {
      return mockProvider.addInteraction({
        state: "a user with email pact-test@example.com does not exist",
        uponReceiving: "a request to register a new user",
        withRequest: {
          method: "POST",
          path: "/api/v1/users/register",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: "pact-test@example.com",
            password: "ValidPassword123!",
          },
        },
        willRespondWith: {
          status: 201,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            id: like("some-id"),
            email: "pact-test@example.com",
          },
        },
      });
    });

    afterEach(() => mockProvider.verify());

    it("should register successfully and return user data", async () => {
      const testApiClient = createTestApiClient("http://localhost:1234");
      const userData = {
        email: "pact-test@example.com",
        password: "ValidPassword123!",
      };

      const result = await testApiClient.registerUser(userData);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("email", "pact-test@example.com");
    });
  });
});
