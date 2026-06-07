import api from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types";
import type {
  CreateMarketPricePayload,
  FinancePagination,
  MarketPrice,
  MarketPricesMeta,
  MarketPriceWithStaleness,
  UpdateMarketPricePayload,
} from "../types";

type MarketPriceListResponse = {
  success: boolean;
  message: string;
  data: MarketPrice[];
  pagination: FinancePagination;
};

type LatestPricesResponse = {
  success: boolean;
  message: string;
  data: { prices: MarketPriceWithStaleness[]; meta: MarketPricesMeta };
};

export const getMarketPrices = async (params?: {
  page?: number;
  limit?: number;
  cropName?: string;
  marketLocation?: string;
}): Promise<MarketPriceListResponse> => {
  const { data } = await api.get<MarketPriceListResponse>("/market-prices", { params });
  return data;
};

export const getLatestMarketPrices = async (): Promise<{
  prices: MarketPriceWithStaleness[];
  meta: MarketPricesMeta;
}> => {
  const { data } = await api.get<LatestPricesResponse>("/market-prices/latest");
  return data.data;
};

export const getMarketPriceById = async (id: string): Promise<ApiResponse<MarketPrice>> => {
  const { data } = await api.get<ApiResponse<MarketPrice>>(`/market-prices/${id}`);
  return data;
};

export const createMarketPrice = async (
  payload: CreateMarketPricePayload
): Promise<ApiResponse<MarketPrice>> => {
  const { data } = await api.post<ApiResponse<MarketPrice>>("/market-prices", payload);
  return data;
};

export const updateMarketPrice = async (
  id: string,
  payload: UpdateMarketPricePayload
): Promise<ApiResponse<MarketPrice>> => {
  const { data } = await api.patch<ApiResponse<MarketPrice>>(`/market-prices/${id}`, payload);
  return data;
};

export const deleteMarketPrice = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(`/market-prices/${id}`);
  return data;
};
