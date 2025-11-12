import { CartResponseDto } from "@dtos/cart/cart.response.dto";

export const MOCK_CART_RESPONSE: CartResponseDto = {
    isSuccess: true,
    message: 'Cart retrieved successfully',
    data: {
        items: [
            {
                productVariantId: 10,
                quantity: 2,
                productName: 'Áo Sơ Mi Nam Trắng Vải Lụa',
                sku: 'ASM-M-WHITE-001',
                imageUrl: 'https://via.placeholder.com/600x600.png?text=Ao+So+Mi+1',
                priceAtTimeOfAdd: 450000
            },
            {
                productVariantId: 15,
                quantity: 1,
                productName: 'Áo Thun Polo Nữ',
                sku: 'ATP-S-BLACK-002',
                imageUrl: 'https://via.placeholder.com/600x600.png?text=Ao+Thun+Polo',
                priceAtTimeOfAdd: 399000
            }
        ],
        totalItemsCount: 3,
        totalPrice: 1299000
    }

};