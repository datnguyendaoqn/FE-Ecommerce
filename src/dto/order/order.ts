import { ApiPaginationResponseDto } from "@dtos/api/api.response.dto";

export type OrderStatus = 'Pending' | 'processing' | 'shipping' | 'completed' | 'cancelled'| 'shipped';

export interface SellerOrderItemDto {
  productName: string;
  imageUrl: string;
  variantInfo: string;
  quantity: number;
  unitPrice: number;
}
export interface SellerOrderDto {
  orderId: number;
  customerName: string;
  phone: string;
  shippingAddress: string;
  orderDate: string;
  status: OrderStatus;
  totalAmountForSeller: number;
  items: SellerOrderItemDto[];
}

export interface BackendOrderItemDto {
  productName: string;
  imageUrl: string;
  variantName: string;
  quantity: number;
  price: number;
}
export interface BackendOrderDto {
  id: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  items: BackendOrderItemDto[];
}

export type SellerOrderApiResponse = ApiPaginationResponseDto<BackendOrderDto>;