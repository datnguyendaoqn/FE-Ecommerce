// axios-instance.ts
import axios from "axios";
import { enviroment } from "src/enviroments/enviroment";
import type { NGXLogger } from "ngx-logger";

let logger: NGXLogger | null = null;

export const initAxios = (logService: NGXLogger) => {
  logger = logService;
};

const skipAuthEndpoints = [
  { method: "POST", path: "/auth/login" },
  { method: "POST", path: "/auth/register-otp" },
  { method: "POST", path: "/auth/register" },
  { method: "ALL", path: /^\/mailer\// },
];

const instance = axios.create({
  baseURL: enviroment.url,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const isTokenExpired = (token: string) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

const handleTokenExpired = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  logger?.warn("Token expired -> redirecting to login...");
  window.location.href = "/login";
};

instance.interceptors.request.use(
  (config) => {
    const requestMethod = config.method?.toUpperCase() || "GET";
    const requestUrl = config.url || "";

    const shouldSkip = skipAuthEndpoints.some((rule) => {
      const methodMatch = rule.method === "ALL" || rule.method === requestMethod;
      const pathMatch =
        typeof rule.path === "string"
          ? requestUrl === rule.path
          : rule.path.test(requestUrl);
      return methodMatch && pathMatch;
    });

    if (shouldSkip) {
      logger?.debug("Skip auth for:", requestMethod, requestUrl);
      return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    logger?.debug("API Response:", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      logger?.info("Received 401 -> Checking token...");
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        logger?.warn("Token expired -> Logging out...");
        await handleTokenExpired();
      }
    }
    return Promise.reject(error);
  }
);

export const axiosInstance = instance;
