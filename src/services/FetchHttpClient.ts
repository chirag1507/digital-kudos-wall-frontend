import { HttpClient } from "@/shared/interfaces/HttpClient";

export class FetchHttpClient implements HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${this.baseUrl}/${normalizedPath}`;
  }

  async get<T>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await fetch(url, {
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
