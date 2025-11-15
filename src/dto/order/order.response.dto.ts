import { ApiResponseDto } from "@dtos/api/api.response.dto"

export interface OrderResponseDto extends ApiResponseDto {
    data: {
        createdOrderIds: number[]
        createdAt: string
    }
}