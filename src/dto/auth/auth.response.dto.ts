import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface AuthGetInforResponseDto extends ApiResponseDto {
    data: {
        cartItemCount: number;
    }
}