import { OrderStatus } from '@dtos/order-customer/order-customer.enum';
// ===================================
// PAYLOADS / REQUEST MODELS
// (Dữ liệu Client gửi lên)
// ===================================
/**
 * Payload để cập nhật trạng thái đơn hàng (cho Shop)
 */
export interface UpdateOrderStatusRequest {
    newStatus: OrderStatus;
}

/**
 * Payload cho một sản phẩm khi tạo đơn hàng (cho Khách hàng)
 */
export interface CreateOrderItemRequest {
    productVariantId: number;
    quantity: number;
}

/**
 * Payload để tạo đơn hàng mới (cho Khách hàng)
 */
export interface CreateOrderRequest {
    shopId: number;
    paymentMethod: string;
    addressId: number; // ID từ ADDRESS_BOOKS
    items: CreateOrderItemRequest[];
}

/**
 * Payload để tạo đánh giá mới (cho Khách hàng)
 * Dựa trên bảng REVIEWS
 */
export interface CreateReviewRequest {
    orderItemId: number;
    variantId: number;
    rating: number; // 1-5
    commentText?: string;
}