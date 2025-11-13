import { CartResponseDto } from "@dtos/cart/cart.response.dto";

export const MOCK_CART_RESPONSE: CartResponseDto = {
    isSuccess: true,
    message: "Cart retrieved successfully",
    data: {
        shops: [
            {
                shopId: 1,
                shopName: "Shop A - Điện tử",
                subTotalPrice: 25000000,
                items: [
                    {
                        productVariantId: 101,
                        productName: "iPhone 15 Pro Max",
                        sku: "IP15PM-256-BLK",
                        imageUrl: "https://via.placeholder.com/150",
                        priceAtTimeOfAdd: 15000000,
                        quantity: 1,
                    },
                    {
                        productVariantId: 102,
                        productName: "MacBook Pro M3",
                        sku: "MBP-M3-512-SLV",
                        imageUrl: "https://via.placeholder.com/150",
                        priceAtTimeOfAdd: 10000000,
                        quantity: 1,
                    }
                ]
            },
            {
                shopId: 2,
                shopName: "Shop B - Thời trang",
                subTotalPrice: 3000000,
                items: [
                    {
                        productVariantId: 201,
                        productName: "Áo khoác denim",
                        sku: "AK-DNM-M-BLU",
                        imageUrl: "https://via.placeholder.com/150",
                        priceAtTimeOfAdd: 500000,
                        quantity: 2,
                    },
                    {
                        productVariantId: 202,
                        productName: "Quần jeans slim fit",
                        sku: "QJ-SLM-32-BLK",
                        imageUrl: "https://via.placeholder.com/150",
                        priceAtTimeOfAdd: 800000,
                        quantity: 1,
                    },
                    {
                        productVariantId: 203,
                        productName: "Giày sneaker",
                        sku: "GS-SNK-42-WHT",
                        imageUrl: "https://via.placeholder.com/150",
                        priceAtTimeOfAdd: 900000,
                        quantity: 1,
                    }
                ]
            },
            {
                shopId: 3,
                shopName: "Shop C - Phụ kiện",
                subTotalPrice: 1500000,
                items: [
                    {
                        productVariantId: 301,
                        productName: "Tai nghe AirPods Pro",
                        sku: "AP-PRO-2-WHT",
                        imageUrl: "https://via.placeholder.com/150",
                        priceAtTimeOfAdd: 1500000,
                        quantity: 1,
                    }
                ]
            }
        ],
        grandTotalPrice: 29500000,
        grandTotalItemsCount: 7
    }
};