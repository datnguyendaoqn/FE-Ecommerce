export enum OrderStatus {
    PENDING_CONFIRMATION = 'PENDING_CONFIRMATION', // Chờ xác nhận
    PROCESSING = 'PROCESSING',                   // Đang xử lý
    SHIPPED = 'SHIPPED',                         // Đã vận chuyển
    DELIVERED = 'DELIVERED',                     // Đã giao hàng (nhưng chưa hoàn thành)
    COMPLETED = 'COMPLETED',                     // Hoàn thành
    CANCELLED = 'CANCELLED',                     // Đã hủy
    RETURN_REFUND = 'RETURN_REFUND'                // Trả hàng/Hoàn tiền
}