declare global {
  interface Window {
    __ENV?: {
      VITE_API_URL?: string;
      PROD?: boolean;
    };
  }
}

const isProd = (): boolean => {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    return false;
  }

  if (typeof window !== "undefined" && window.__ENV) {
    return !!window.__ENV.PROD;
  }

  return process.env.NODE_ENV === "production";
};

const getApiBaseUrl = (): string => {
  // In test environment
  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    return "http://localhost:3001";
  }

  // In production/UAT
  if (isProd()) {
    return "/api";
  }

  // Try to get from window.__ENV (set during build)
  if (typeof window !== "undefined" && window.__ENV?.VITE_API_URL) {
    return window.__ENV.VITE_API_URL;
  }

  // Development fallback
  return "http://localhost:3001";
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
};
