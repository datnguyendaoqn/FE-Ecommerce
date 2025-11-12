import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface ProductMediaDto {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface VariantMediaDto {
  id: number;
  imageUrl: string;
}

export interface SellerProductVariantDetailDto {
  id: number;
  sku: string;
  variantSize: string | null;
  color: string | null;
  material: string | null;
  price: number;
  quantity: number;
  primaryImage: VariantMediaDto | null;
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

  productImages: ProductMediaDto[]; 

  variants: SellerProductVariantDetailDto[];
}

export interface SellerProductDetailApiResponseDto extends ApiResponseDto {
  data: SellerProductDetailDto;
}