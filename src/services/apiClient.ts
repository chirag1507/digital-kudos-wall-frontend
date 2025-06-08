export interface RegisterUserPayload {
  email: string;
  password: string;
}

export const apiClient = {
  registerUser: async (payload: RegisterUserPayload) => {
    const response = await fetch("http://localhost:3000/api/v1/users/register", {
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
};
