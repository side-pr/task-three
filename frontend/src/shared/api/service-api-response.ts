export interface ServiceApiResponse<T> {
  status: number;
  message: string;
  data: T;
}