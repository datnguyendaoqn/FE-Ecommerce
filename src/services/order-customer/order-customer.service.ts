import { OrderStatus } from "@dtos/order-customer/order-customer.enum";
import { Order, OrderItem } from "@dtos/order-customer/order-customer.response.dto";
import { Injectable } from "@angular/core";

// Đây là một lớp Service (dịch vụ) giả lập
// Lớp này sẽ gọi API (ví dụ: dùng fetch hoặc axios) để lấy dữ liệu.
// Dữ liệu mock đã được cập nhật theo model mới (dựa trên SQL).
@Injectable({
    providedIn: 'root'
})
export class OrderCustomerService {

    // Dữ liệu giả lập (mock data)
    mockOrders: Order[] = [
        {
            id: 501,
            userId: 1,
            shop: { id: 10, name: 'Coolmate Official' },
            isShopLiked: true, // API sẽ cung cấp trường này
            status: OrderStatus.COMPLETED,
            statusText: 'Giao hàng thành công',
            items: [
                {
                    id: 101,
                    productVariantId: 201,
                    productName: 'Áo thun nam Cotton Compact In Local Brand',
                    variantName: 'Phân loại hàng: Đen, L',
                    imageUrl: 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Ao+Thun',
                    quantity: 2,
                    sku: 'CM-CT-BLK-L',
                    priceAtPurchase: 199000
                }
            ],
            totalAmount: 398000,
            paymentMethod: 'COD',
            shippingAddress: {
                fullName: 'Nguyễn Văn A',
                phone: '0901234567',
                addressLine: '123 Đường ABC',
                ward: 'Phường 10',
                district: 'Quận 3',
                city: 'TP. Hồ Chí Minh'
            },
            createdAt: '2025-10-20T10:30:00Z',
            canReview: true,
            reviewDueDate: '10-12-2025',
            canRequestReturn: true
        },
        {
            id: 502,
            userId: 1,
            shop: { id: 11, name: 'Routine' },
            isShopLiked: false,
            status: OrderStatus.SHIPPED,
            statusText: 'Đang vận chuyển',
            items: [
                {
                    id: 102,
                    productVariantId: 202,
                    productName: 'Quần Jeans Nam Slimfit Ống Côn',
                    variantName: 'Phân loại hàng: Xanh Nhạt, 32',
                    imageUrl: 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Quan+Jeans',
                    quantity: 1,
                    sku: 'RT-JN-SLM-32',
                    priceAtPurchase: 550000
                },
                {
                    id: 103,
                    productVariantId: 203,
                    productName: 'Áo Sơ Mi Nam Tay Dài Vải Lụa',
                    variantName: 'Phân loại hàng: Trắng, M',
                    imageUrl: 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Ao+So+Mi',
                    quantity: 1,
                    sku: 'RT-SM-LUA-M',
                    priceAtPurchase: 420000
                }
            ],
            totalAmount: 970000,
            paymentMethod: 'VNPAY',
            shippingAddress: {
                fullName: 'Trần Thị B',
                phone: '0901234588',
                addressLine: '456 Đường XYZ',
                ward: 'Phường Bến Nghé',
                district: 'Quận 1',
                city: 'TP. Hồ Chí Minh'
            },
            createdAt: '2025-11-10T14:00:00Z',
            canReview: false,
            canRequestReturn: false // Chưa giao xong nên chưa thể trả
        },
        {
            id: 503,
            userId: 1,
            shop: { id: 12, name: 'HADES Studio' },
            isShopLiked: true,
            status: OrderStatus.PENDING_CONFIRMATION,
            statusText: 'Chờ xác nhận',
            items: [
                {
                    id: 104,
                    productVariantId: 204,
                    productName: 'Áo Hoodie Zip Form Rộng "Chaos"',
                    variantName: 'Phân loại hàng: Xám Lông Chuột, L',
                    imageUrl: 'https://placehold.co/100x100/e2e8f0/94a3b8?text=Hoodie',
                    quantity: 1,
                    sku: 'HDS-HD-CHAOS-L',
                    priceAtPurchase: 799000
                }
            ],
            totalAmount: 799000,
            paymentMethod: 'COD',
            shippingAddress: {
                fullName: 'Nguyễn Văn A',
                phone: '0901234567',
                addressLine: '123 Đường ABC',
                ward: 'Phường 10',
                district: 'Quận 3',
                city: 'TP. Hồ Chí Minh'
            },
            createdAt: '2025-11-14T18:00:00Z',
            canReview: false,
            canRequestReturn: false
        }
    ];

    /**
     * Lấy danh sách đơn hàng từ API (giả lập)
     * @param tab - Tab đang được chọn (ví dụ: 'all' hoặc một trạng thái cụ thể)
     * @param searchTerm - Từ khóa tìm kiếm (nếu có)
     */
    async getOrders(tab: 'all' | OrderStatus, searchTerm: string = ''): Promise<Order[]> {
        console.log(`[Service] Đang tải đơn hàng cho tab: ${tab}, tìm kiếm: '${searchTerm}'`);

        // Giả lập độ trễ mạng
        await new Promise(resolve => setTimeout(resolve, 500));

        let results = this.mockOrders;

        // 1. Lọc theo tab
        if (tab !== 'all') {
            results = results.filter(order => order.status === tab);
        }

        // 2. Lọc theo từ khóa tìm kiếm (tìm kiếm đơn giản)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            results = results.filter(order =>
                order.id.toString().includes(lowerCaseSearch) || // Tìm theo ID đơn hàng
                order.shop.name.toLowerCase().includes(lowerCaseSearch) || // Tìm theo tên shop
                order.items.some((item: Order["items"][number]) =>
                    item.productName.toLowerCase().includes(lowerCaseSearch)
                )
                // Tìm theo tên SP
            );
        }

        // Trả về bản sao để tránh thay đổi dữ liệu gốc
        return JSON.parse(JSON.stringify(results));
    }
    async getOrderById(id: number): Promise<Order> {
        const order = this.mockOrders.find(o => o.id === id);
        await new Promise(r => setTimeout(r, 200));
        if (!order) throw new Error("Order not found");
        return JSON.parse(JSON.stringify(order));
    }
    /**
     * [MỚI] Cập nhật trạng thái đơn hàng (cho Shop Admin)
     */
    async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<Order> {
        console.log(`[Service] Cập nhật đơn hàng ${orderId} sang trạng thái ${newStatus}`);

        // Giả lập độ trễ mạng
        await new Promise(resolve => setTimeout(resolve, 300));

        const orderIndex = this.mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            // Cập nhật trạng thái trong dữ liệu mock
            this.mockOrders[orderIndex].status = newStatus;

            // Cập nhật statusText
            switch (newStatus) {
                case OrderStatus.SHIPPED: this.mockOrders[orderIndex].statusText = "Đang vận chuyển"; break;
                case OrderStatus.COMPLETED: this.mockOrders[orderIndex].statusText = "Giao hàng thành công"; break;
                case OrderStatus.CANCELLED: this.mockOrders[orderIndex].statusText = "Đã hủy"; break;
            }

            // Trả về đơn hàng đã cập nhật
            return JSON.parse(JSON.stringify(this.mockOrders[orderIndex]));
        } else {
            throw new Error('Không tìm thấy đơn hàng');
        }
    }

    /**
     * Giả lập hành động 'Mua Lại'
     */
    async buyAgain(orderId: number): Promise<boolean> {
        console.log(`Yêu cầu mua lại cho đơn hàng: ${orderId}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Giả lập thành công
        return true;
    }

    /**
     * Giả lập hành động 'Đánh Giá'
     */
    async reviewOrder(orderId: number): Promise<boolean> {
        console.log(`Điều hướng đến trang đánh giá cho đơn hàng: ${orderId}`);
        return true;
    }
}