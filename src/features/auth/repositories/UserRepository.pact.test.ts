import { Pact, Matchers } from "@pact-foundation/pact";
import path from "path";
import { FetchHttpClient } from "@/services/FetchHttpClient";
import { UserRepository } from "@/features/auth/repositories/UserRepository";

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
      const httpClient = new FetchHttpClient("http://127.0.0.1:1234");
      const userRepository = new UserRepository(httpClient);
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

describe("UserRepository - User Login Contract", () => {
  beforeAll(() => mockProvider.setup());
  afterAll(() => mockProvider.finalize());

  describe("when logging in with valid credentials", () => {
    beforeEach(() => {
      return mockProvider.addInteraction({
        state: "a user exists with email pact-test@example.com",
        uponReceiving: "a request to login with valid credentials",
        withRequest: {
          method: "POST",
          path: "/users/login",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: "pact-test@example.com",
            password: "ValidPassword123!",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            user: {
              id: like("some-id"),
              name: like("pact-test-user"),
              email: "pact-test@example.com",
            },
            token: like("jwt.token.here"),
          },
        },
      });
    });

    afterEach(() => mockProvider.verify());

    it("should login successfully and return user data with token", async () => {
      const httpClient = new FetchHttpClient("http://127.0.0.1:1234");
      const userRepository = new UserRepository(httpClient);
      const credentials = {
        email: "pact-test@example.com",
        password: "ValidPassword123!",
      };

      const result = await userRepository.login(credentials);

      expect(result).toHaveProperty("user");
      expect(result.user).toHaveProperty("id");
      expect(result.user).toHaveProperty("name");
      expect(result.user).toHaveProperty("email", "pact-test@example.com");
      expect(result).toHaveProperty("token");
    });
  });

  describe("when logging in with invalid credentials", () => {
    beforeEach(() => {
      return mockProvider.addInteraction({
        state: "a user exists with email pact-test@example.com",
        uponReceiving: "a request to login with invalid credentials",
        withRequest: {
          method: "POST",
          path: "/users/login",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            email: "pact-test@example.com",
            password: "WrongPassword123!",
          },
        },
        willRespondWith: {
          status: 401,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {
            message: like("Invalid credentials"),
          },
        },
      });
    });

    afterEach(() => mockProvider.verify());

    it("should handle login failure with invalid credentials", async () => {
      const httpClient = new FetchHttpClient("http://127.0.0.1:1234");
      const userRepository = new UserRepository(httpClient);
      const credentials = {
        email: "pact-test@example.com",
        password: "WrongPassword123!",
      };

      await expect(userRepository.login(credentials)).rejects.toThrow("Invalid credentials");
    });
  });
});
