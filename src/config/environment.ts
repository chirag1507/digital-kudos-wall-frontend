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

  // Try to get from window.__ENV (set during build)
  if (typeof window !== "undefined" && window.__ENV?.VITE_API_URL) {
    return window.__ENV.VITE_API_URL;
  }

  // In production/UAT, use the same host but with port 3001
  if (isProd() && typeof window !== "undefined") {
    const currentUrl = new URL(window.location.href);
    // For UAT environment, use the direct IP/hostname
    if (currentUrl.hostname === "13.201.16.118" || process.env.NODE_ENV === "uat") {
      return "http://13.201.16.118:3001";
    }
    return `${currentUrl.protocol}//${currentUrl.hostname}:3001`;
  }

  // Development fallback
  return "http://localhost:3001";
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
};
