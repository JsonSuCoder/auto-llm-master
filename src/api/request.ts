import { SEVER_URL } from "./config";

// Token management
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";
export const setUserInfo = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserInfo = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Common HTTP request function with automatic authentication header injection
 * @param url - Full URL for the request
 * @param options - Request options
 * @returns Promise with response data
 */
export const request = async <T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { method = "GET", body, headers = {} } = options;

  // Build headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const userInfo = getUserInfo();
  if (userInfo) {
    // Add user info as a JSON string in header
    requestHeaders["X-User-Info"] = JSON.stringify(userInfo);

    // Optionally, you can also add specific user fields as separate headers
    if (userInfo.id) {
      requestHeaders["X-User-Id"] = userInfo.id;
    }
    if (userInfo.email) {
      requestHeaders["X-User-Email"] = userInfo.email;
    }
    if (userInfo.role) {
      requestHeaders["X-User-Role"] = userInfo.role;
    }
  }

  // Build request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};

/**
 * Helper function to build full URL with server base URL
 * @param endpoint - API endpoint path
 * @returns Full URL
 */
export const buildUrl = (endpoint: string): string => {
  return `${SEVER_URL}${endpoint}`;
};
