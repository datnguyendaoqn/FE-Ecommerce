import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface SellerProductSummaryDto {
  id: number;
  name: string;
  primaryImageUrl: string | null;
  minPrice: number;
  variantCount: number;
  status: string;
  categoryId: number;
  categoryName: string;
}

export interface SellerProductSummaryApiResponseDto extends ApiResponseDto {
  data: SellerProductSummaryDto[];
}