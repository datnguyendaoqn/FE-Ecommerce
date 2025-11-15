import { OrderStatus } from "@dtos/order-customer/order-customer.enum";
// ===================================
// DTOS / RESPONSE MODELS
// (Dữ liệu API trả về)
// ===================================
/**
 * Thông tin Cửa hàng (Từ bảng SHOPS)
 */
export interface Shop {
    id: number;
    name: string;
    // Ghi chú: "isLiked" (Yêu thích) không có trong bảng SHOPS.
    // Đây sẽ là dữ liệu bổ sung mà API phải join từ một bảng khác (ví dụ: user_favorite_shops)
}

/**
 * Thông tin Sản phẩm trong đơn hàng (Từ bảng ORDER_ITEMS - Dạng Snapshot)
 */
export interface OrderItem {
    id: number; // ORDER_ITEMS.ID
    quantity: number; // QUANTITY
    priceAtPurchase: number; // PRICE_AT_TIME_OF_PURCHASE
    sku: string; // SKU
    productName: string; // PRODUCT_NAME
    variantName: string; // VARIANT_NAME
    imageUrl: string; // IMAGE_URL
    productVariantId: number | null; // PRODUCT_VARIANT_ID (có thể null nếu variant bị xóa)
}

/**
 * Thông tin Địa chỉ giao hàng (Từ các cột snapshot trong bảng ORDERS)
 */
export interface ShippingAddress {
    fullName: string; // SHIPPING_FULL_NAME
    phone: string; // SHIPPING_PHONE
    addressLine: string; // SHIPPING_ADDRESS_LINE
    ward: string; // SHIPPING_WARD
    district: string; // SHIPPING_DISTRICT
    city: string; // SHIPPING_CITY
}

/**
 * Thông tin chi tiết một Đơn hàng
 * (Kết hợp từ bảng ORDERS, SHOPS, và ORDER_ITEMS)
 */
export interface Order {
    id: number; // ORDERS.ID
    userId: number; // ORDERS.USER_ID
    status: OrderStatus | string; // ORDERS.STATUS
    totalAmount: number; // ORDERS.TOTAL_AMOUNT
    paymentMethod: string; // ORDERS.PAYMENT_METHOD
    cancellationReason?: string | null; // ORDERS.CANCELLATION_REASON
    
    shippingAddress: ShippingAddress; // Dữ liệu snapshot

    createdAt: string; // ORDERS.CREATED_AT (dạng ISO string)
    updatedAt?: string | null; // ORDERS.UPDATED_AT

    // Dữ liệu đã được join (từ API)
    shop: Shop;
    items: OrderItem[];

    // Các trường logic (do API tính toán và gửi về)
    statusText: string; // Ví dụ: "Giao hàng thành công"
    canReview: boolean;
    reviewDueDate?: string;
    canRequestReturn: boolean;
    isShopLiked: boolean; // Dữ liệu join từ bảng yêu thích (không có trong schema)
}

