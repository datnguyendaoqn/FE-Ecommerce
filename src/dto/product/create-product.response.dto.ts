import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface CreateVariantResponseDto {
  id: number;
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CreateProductResponseDto {
  id: number;
  name: string;
  shopId: number;
  variants: CreateVariantResponseDto[];
  productImageUrl: string | null;
  variantCount: number;
}

export interface CreateProductApiResponseDto extends ApiResponseDto {
  data: CreateProductResponseDto;
}