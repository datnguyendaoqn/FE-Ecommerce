import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface SellerProductVariantDetailDto {
  id: number;
  sku: string;
  variantSize: string | null;
  color: string | null;
  material: string | null;
  price: number;
  quantity: number;
  primaryImageUrl: string | null;
}

export interface SellerProductDetailDto {
  id: number;
  name: string;
  description: string | null;
  brand: string | null;
  categoryId: number;
  categoryName: string;
  shopId: number;
  status: string;
  primaryImageUrl: string | null;
  galleryImageUrls: string[];
  variants: SellerProductVariantDetailDto[];
}

export interface SellerProductDetailApiResponseDto extends ApiResponseDto {
  data: SellerProductDetailDto;
}