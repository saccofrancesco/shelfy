import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const accessTokenKey = "shelfy_access_token";
const refreshTokenKey = "shelfy_refresh_token";

const http = axios.create({
  baseURL,
});

export function getStoredAccessToken() {
  return window.localStorage.getItem(accessTokenKey);
}

export function getStoredRefreshToken() {
  return window.localStorage.getItem(refreshTokenKey);
}

export function setStoredTokens({ accessToken, refreshToken }) {
  if (accessToken) window.localStorage.setItem(accessTokenKey, accessToken);
  if (refreshToken) window.localStorage.setItem(refreshTokenKey, refreshToken);
}

export function clearStoredTokens() {
  window.localStorage.removeItem(accessTokenKey);
  window.localStorage.removeItem(refreshTokenKey);
}

http.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;
export { http };
