import { API_SERVER_URL } from "./config";
import axios, { AxiosInstance, AxiosResponse } from "axios";

const TIMEOUT = 10000;
export const apiRequester: AxiosInstance = axios.create({
  baseURL: API_SERVER_URL,
  timeout: TIMEOUT,
});

apiRequester.interceptors.response.use((response: AxiosResponse) => response);

// apiRequester.interceptors.request.use(
//   async (config) => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     throw error;
//   }
// );

// const getAccessToken = (): string | null => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem(ACCESS_TOKEN);
// };
