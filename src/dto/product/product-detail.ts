import { ApiResponseDto } from "@dtos/api/api.response.dto";
import { ReviewResponseDto } from "@dtos/review/review";

export interface ProductDetailResponseDto {
    id: number;
    name: string;
    description: string;
    brand: string;
    primaryImageUrl: string;
    galleryImageUrls: string[];
    variants: ProductVariantDetailDto[];
    reviews?: ReviewResponseDto[];
}

export interface ProductVariantDetailDto {
    id: number;
    productId: number;
    sku: string;
    variantSize?: string;     // kích thước
    color?: string;           // màu sắc
    material?: string;        // chất liệu
    price: number;            // giá tiền
    quantity: number;         // số lượng tồn kho
    primaryImageUrl?: string; // ảnh đại diện
}
