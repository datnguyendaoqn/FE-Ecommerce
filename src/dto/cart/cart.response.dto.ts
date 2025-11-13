import { ApiResponseDto } from "@dtos/api/api.response.dto";
import { CartShopDto } from "./cart.dto";

export interface CartResponseDto extends ApiResponseDto {
    data: {
        shops: CartShopDto[],
        grandTotalPrice: number,
        grandTotalItemsCount: number
    }

}