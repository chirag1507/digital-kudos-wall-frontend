const API_BASE_URL = "http://localhost:3000";

export interface RegisterUserPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
}

export const createApiClient = (baseUrl: string) => ({
  registerUser: async (payload: RegisterUserPayload): Promise<User> => {
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

export const apiClient = createApiClient(API_BASE_URL);
