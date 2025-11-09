import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface UpdateProductResponseDto {
  id: number;
  updatedAt: string; 
  categoryName: string;
}

export interface UpdateProductApiResponseDto extends ApiResponseDto {
  data: UpdateProductResponseDto;
}