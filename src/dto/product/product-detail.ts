import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface ProductDetailResponseDto extends ApiResponseDto {
    data: ProductDetailDto;
}

export interface ProductDetailDto {
    // === 1. Thông tin cơ bản ===
    id: number;
    name: string;
    description: string;
    brand: string;
    categoryName: string;

    // === 2. Ảnh sản phẩm ===
    productImages: ProductImageDto[];

    // === 3. Biến thể (variants) ===
    variants: ProductVariantDetailDto[];
}

export interface ProductImageDto {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
}

export interface ProductVariantDetailDto {
    id: number;
    variantSize?: string;
    color?: string;
    material?: string;
    price: number;
    isInStock: boolean;
    primaryImage: {
        id: number;
        imageUrl: string;
    };
}
