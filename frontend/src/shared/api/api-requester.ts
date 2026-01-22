import { API_SERVER_URL } from "./config";
import axios, { AxiosInstance, AxiosResponse } from "axios";

const TIMEOUT = 10000;
export const apiRequester: AxiosInstance = axios.create({
  baseURL: API_SERVER_URL,
  timeout: TIMEOUT,
});

apiRequester.interceptors.response.use((response: AxiosResponse) => response);
