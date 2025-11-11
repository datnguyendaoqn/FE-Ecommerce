import { ApiPaginationResponseDto } from "@dtos/api/api.response.dto";

export interface ProductSummaryDto {
    id: number,
    name: string,
    primaryImageUrl: string,
    minPrice: number,
    averageRating: number,
    reviewCount: number,
    selledCount: number
}


export interface ProductPaginationDto extends ApiPaginationResponseDto<ProductSummaryDto> { }