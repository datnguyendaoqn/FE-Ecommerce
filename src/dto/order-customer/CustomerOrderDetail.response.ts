import { CustomerOrderItemDto } from '@dtos/order-customer/CustomerOrder.response.dto';
import { ApiResponseDto } from '@dtos/api/api.response.dto';
export interface CustomerOrderDetailResponseDto {
   id: number;
  shopId: number;
  shopName: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;  // ISO string từ API, muốn dùng Date thì convert trong component
  // Địa chỉ (snapshot)
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine: string;
  shippingWard: string;
  shippingDistrict: string;
  shippingCity: string;
  shippingNote?: string | null;
  cancellationReason?: string | null;

  // Danh sách sản phẩm
  items: CustomerOrderItemDto[];
}
export interface  CustomerOrderDetailApiResponseDto extends ApiResponseDto {
  data: CustomerOrderDetailResponseDto;
}