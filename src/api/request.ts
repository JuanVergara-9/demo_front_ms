// src/api/request.ts
import apiClient from './apiClient';
import { AxiosRequestConfig } from 'axios';

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
