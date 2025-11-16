// DTO cho item con trong đơn hàng
export interface CustomerOrderItemDto {
  productName: string;
  variantName: string; // "Size L, Màu Đen"
  sku: string;
  quantity: number;
  price: number; // PriceAtTimeOfPurchase
  imageUrl: string;
}

// DTO cho chi tiết đơn hàng (có thể dùng cho lịch sử mua hàng)
export interface CustomerOrderResponseDto {
  id: number;
  shopId: number;
  shopName: string; // (Sẽ thêm ở Bước 3)
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string | Date; // ISO string từ API, muốn dùng Date thì convert trong component
  totalItemsCount: number;
  items: CustomerOrderItemDto[];
  canReview?: boolean;
  canRequestReturn?: boolean;
}