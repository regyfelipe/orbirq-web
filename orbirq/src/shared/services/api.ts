const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private baseURL: string;
  private timeout = 10000; // 10s

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        const errorBody = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorBody.message || "Erro na API",
          details: errorBody,
        };
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null as T;
      }

      const responseText = await response.text();
      console.log("🔍 [API] Response text:", responseText);
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ [API] Failed to parse JSON:", parseError);
        return responseText;
      }
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw { status: 408, message: "Tempo de requisição esgotado" };
      }

      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: "GET" });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiService(API_BASE_URL);
