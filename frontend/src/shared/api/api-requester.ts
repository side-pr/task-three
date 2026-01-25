import { INTERNAL_API_SERVER_URL } from "@shared/api/config";
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useVisitorStore } from "@entities/visitor";

const TIMEOUT = 10000;
export const apiRequester: AxiosInstance = axios.create({
  baseURL: INTERNAL_API_SERVER_URL,
  timeout: TIMEOUT,
});

apiRequester.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const visitorId = useVisitorStore.getState().getVisitorId();
    config.headers.set('X-Visitor-Id', visitorId);
    return config;
  }
);

apiRequester.interceptors.response.use((response: AxiosResponse) => response);
