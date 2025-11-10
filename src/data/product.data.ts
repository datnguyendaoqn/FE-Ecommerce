import { ProductSummaryDto } from "@dtos/product/product";
import { ProductDetailResponseDto } from "@dtos/product/product-detail";

export const productsMock: ProductSummaryDto[] = [
    {
        "id": 101,
        "name": "Áo Khoác Bomber Kaki Cao Cấp (Mẫu)",
        "primaryImageUrl": "https://placehold.co/300x300/F0E68C/000?text=Ao+Khoac",
        "minPrice": 350000.0,
        "averageRating": 4.8,
        "reviewCount": 132,
        "selledCount": 1500
    },
    {
        "id": 102,
        "name": "Áo Thun Cotton Trơn Basic (Mẫu)",
        "primaryImageUrl": "https://placehold.co/300x300/ADD8E6/000?text=Ao+Thun",
        "minPrice": 150000.0,
        "averageRating": 4.5,
        "reviewCount": 88,
        "selledCount": 750
    }
];

export const productDetailMocks: ProductDetailResponseDto = {
    "isSuccess": true,
    "code": null,
    "message": "Lấy chi tiết sản phẩm thành công",
    "data": {
        // === 1. Thông tin cơ bản ===
        "id": 101,
        "name": "Áo Khoác Bomber Kaki Cao Cấp (Mẫu)",
        "description": "Một chiếc áo khoác bomber thời trang, chất liệu kaki dày dặn, phù hợp cho thời tiết se lạnh. Thiết kế hiện đại, dễ phối đồ, có 2 màu Đen và Vàng.",
        "brand": "Li-Ning",
        "categoryName": "Áo Khoác",

        // === 2. Ảnh (Product) ===
        "productImages": [
            {
                "id": 201,
                "imageUrl": "https://placehold.co/600x600/F0E68C/000?text=Ao+Khoac+1",
                "isPrimary": true
            },
            {
                "id": 202,
                "imageUrl": "https://placehold.co/600x600/F0E68C/000?text=Ao+Khoac+2",
                "isPrimary": false
            },
            {
                "id": 203,
                "imageUrl": "https://placehold.co/600x600/F0E68C/000?text=Ao+Khoac+3",
                "isPrimary": false
            }
        ],

        // === 3. Biến thể (Variants) - Đã ẩn SKU/Quantity ===
        "variants": [
            {
                "id": 301,
                "variantSize": "S",
                "color": "Đen",
                "material": "Kaki",
                "price": 350000.0,
                "isInStock": true,
                "primaryImage": {
                    "id": 401,
                    "imageUrl": "https://placehold.co/100x100/333333/FFF?text=Den"
                }
            },
            {
                "id": 302,
                "variantSize": "M",
                "color": "Xanh",
                "material": "Kaki",
                "price": 320000.0,
                "isInStock": true,
                "primaryImage": {
                    "id": 402,
                    "imageUrl": "https://placehold.co/100x100/333333/FFF?text=Xanh"
                }
            },
            {
                "id": 303,
                "variantSize": "L",
                "color": "Vàng",
                "material": "Kaki",
                "price": 360000.0,
                "isInStock": false, // <-- Hết hàng
                "primaryImage": {
                    "id": 403,
                    "imageUrl": "https://placehold.co/100x100/F0E68C/000?text=Vang"
                }
            }
        ],

        // // === 4. Thông tin Shop (MỚI) ===
        // "shopInfo": {
        //     "id": 1,
        //     "name": "Shop Thời Trang ABC (Mẫu)",
        //     "avatarUrl": "https://placehold.co/100x100/CCCCCC/000?text=Shop+ABC"
        // }

        // === 5. PHẦN REVIEW ĐÃ BỊ LOẠI BỎ ===
        // (FE sẽ gọi API 'GET /api/products/101/reviews?page=1' riêng)
        //6. Review cho shop cũng gọi api lấy data riêng
    }
}