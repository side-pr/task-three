import { INTERNAL_API_SERVER_URL } from "@shared/api/config";
import axios, { AxiosInstance, AxiosResponse } from "axios";

const TIMEOUT = 10000;
export const apiRequester: AxiosInstance = axios.create({
  baseURL: INTERNAL_API_SERVER_URL,
  timeout: TIMEOUT,
});

apiRequester.interceptors.response.use((response: AxiosResponse) => response);
