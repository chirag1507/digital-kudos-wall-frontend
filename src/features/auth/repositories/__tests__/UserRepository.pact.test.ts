import { Pact, Matchers } from "@pact-foundation/pact";
import path from "path";
import { FetchHttpClient } from "@/services/FetchHttpClient";
import { UserRepositoryImpl } from "@/features/auth/repositories/UserRepository";

const { like } = Matchers;

const mockProvider = new Pact({
  consumer: "DigitalKudosWallFrontend",
  provider: "DigitalKudosWallBackend",
  port: 1234,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "info",
});

describe("UserRepository - User Registration Contract", () => {
  beforeAll(() => mockProvider.setup());
  afterAll(() => mockProvider.finalize());

  describe("when registering a new user", () => {
    beforeEach(() => {
      return mockProvider.addInteraction({
        state: "a user with email pact-test@example.com does not exist",
        uponReceiving: "a request to register a new user",
        withRequest: {
          method: "POST",
          path: "/users/register",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            name: "pact-test-user",
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
            name: "pact-test-user",
            email: "pact-test@example.com",
          },
        },
      });
    });

    afterEach(() => mockProvider.verify());

    it("should register successfully and return user data", async () => {
      const httpClient = new FetchHttpClient(mockProvider.mockService.baseUrl);
      const userRepository = new UserRepositoryImpl(httpClient);
      const userData = {
        name: "pact-test-user",
        email: "pact-test@example.com",
        password: "ValidPassword123!",
      };

      const result = await userRepository.register(userData);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name", "pact-test-user");
      expect(result).toHaveProperty("email", "pact-test@example.com");
    });
  });
});
