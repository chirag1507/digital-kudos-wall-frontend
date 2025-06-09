export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  // We can add put, delete, etc. here in the future
}
