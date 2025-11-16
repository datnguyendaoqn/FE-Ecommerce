import { OrderStatus } from "./order-customer.enum";

export interface CustomerOrderDetailItemDto {
  productName: string;
  imageUrl: string;
  variantName: string;
  quantity: number;
  price: number;
  reviewId: number | null;
}

export interface CustomerOrderDetailResponseDto {
  orderId: number;
  orderDate: string;
  shopName: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: string;
  items: CustomerOrderDetailItemDto[];
}