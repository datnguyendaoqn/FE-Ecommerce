import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface ReviewResponseDto {
    id: number;
    authorName: string;
    rating: number;
    comment?: string;
    createdAt: string;
    variantInfo: string;
}


export interface ReviewApiResponseDto extends ApiResponseDto {
    data: ReviewResponseDto[]
}