import axios, { isAxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL as string || "http://localhost:3000/api/v1";
const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY as string;
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY as string;

const api = axios.create({ baseURL: BASE_URL });

/* ── Request: attach access token ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Token refresh queue ── */
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const drainQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  );
  pendingQueue = [];
};

/* ── Response: extract API message + auto-refresh on 401 ── */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (typeof error.config) & { _retry?: boolean };

    /* Surface the backend's message field for every non-2xx */
    if (isAxiosError(error) && error.response?.status !== 401) {
      if (error.response?.data?.message) {
        return Promise.reject(new Error(error.response.data.message as string));
      }
      return Promise.reject(error);
    }

    /* 401 on auth endpoints themselves — clear and reject */
    const isAuthEndpoint =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/refresh-token");

    if (isAxiosError(error) && error.response?.status === 401 && isAuthEndpoint) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      if (error.response?.data?.message) {
        return Promise.reject(new Error(error.response.data.message as string));
      }
      return Promise.reject(error);
    }

    /* 401 on a normal request — attempt token refresh */
    if (isAxiosError(error) && error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return Promise.reject(new Error("Session expired. Please sign in again."));
      }

      if (isRefreshing) {
        /* Queue this request until refresh completes */
        return new Promise<string>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(`${BASE_URL}/auth/refresh-token`, { refreshToken });

        const { accessToken, refreshToken: newRefresh } = data.data;
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);

        drainQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        drainQueue(refreshError, null);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return Promise.reject(new Error("Session expired. Please sign in again."));
      } finally {
        isRefreshing = false;
      }
    }

    if (isAxiosError(error) && error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message as string));
    }

    return Promise.reject(error);
  }
);

export default api;
