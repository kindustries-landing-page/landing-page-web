import axios from 'axios';
import { Product } from '@/src/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:10000/api/v1',
  timeout: 15000,
});

export type WarrantyCheckResponse = {
  found: boolean;
  vehicle: {
    frame_no: string;
    engine_no: string;
    vin?: string | null;
    model_code?: string | null;
    model_name?: string | null;
    warranty_status: string;
    delivery_date?: string | null;
  };
  active_warranty: {
    warranty_code: string;
    status: string;
    activated_date: string;
    activated_at: string;
    warranty_start_date: string;
    warranty_end_date: string;
  } | null;
};

export type WarrantyActivatePayload = {
  sokhung: string;
  somay: string;
  customer_name?: string;
  customer_phone?: string;
  notes?: string;
};

export type WarrantyActivateResponse = {
  message: string;
  activation: {
    id: string;
    warranty_code: string;
    activated_date: string;
    activated_at: string;
    warranty_start_date: string;
    warranty_end_date: string;
    status: string;
  };
  vehicle: {
    id: string;
    frame_no: string;
    engine_no: string;
    vin?: string | null;
    warranty_status: string;
  };
};

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products');
  return data;
};

export const submitContact = async (formData: Record<string, unknown>) => {
  const { data } = await api.post('/contact', formData);
  return data;
};

export const checkWarranty = async (
  sokhung: string,
  somay: string
): Promise<WarrantyCheckResponse> => {
  const { data } = await api.get('/public/warranty/check', {
    params: { sokhung, somay },
  });
  return data;
};

export const activateWarranty = async (
  payload: WarrantyActivatePayload
): Promise<WarrantyActivateResponse> => {
  const { data } = await api.post('/public/warranty/activate', payload);
  return data;
};

export const extractApiError = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
};
