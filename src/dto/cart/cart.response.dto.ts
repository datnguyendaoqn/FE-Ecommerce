import { ApiResponseDto } from "@dtos/api/api.response.dto";
import { CartProductVariantDto } from "@dtos/product-variant/product-variant";

export interface CartResponseDto extends ApiResponseDto {
    data: {
        items: CartProductVariantDto[],
        totalItemsCount: number,
        totalPrice: number
    }

}