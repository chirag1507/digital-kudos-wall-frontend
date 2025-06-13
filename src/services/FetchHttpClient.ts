import { HttpClient } from "@/shared/interfaces/HttpClient";

export class FetchHttpClient implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseText = await response.text();

      try {
        const errorBody = JSON.parse(responseText);
        const errorMessage = errorBody.message || "An unknown error occurred.";
        throw new Error(errorMessage);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        } else {
          throw parseError;
        }
      }
    }

    return response.json();
  }
}
