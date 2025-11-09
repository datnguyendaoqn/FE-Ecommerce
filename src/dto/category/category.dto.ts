import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface RecursiveCategoryDto {
  id: number;
  name: string;
  parentId: number | null;
  children: RecursiveCategoryDto[];
}

export interface CategoryApiResponseDto extends ApiResponseDto {
  data: RecursiveCategoryDto[];
}