import { CartResponseDto } from "@dtos/cart/cart.response.dto";
import { BaseApiService } from "../api.service";
import { CartRequestDto, CartUpdateRequestDtp } from "@dtos/cart/cart.request.dto";
import { HelperService } from "src/helpers/hepler.service";
import { NGXLogger } from "ngx-logger";
import { axiosInstance } from "src/configs/axiosInstance";
import { ApiResponseDto } from "@dtos/api/api.response.dto";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class CartService extends BaseApiService<CartRequestDto, CartResponseDto> {
    constructor(
        protected override readonly helper: HelperService,
        protected override readonly logger: NGXLogger
    ) {
        super("/carts", helper, logger,)
    }


    async getCart(): Promise<CartResponseDto> {
        try {
            const res = await axiosInstance.get<CartResponseDto>(this.endpoint)
            return res.data
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }


    async createCartItem(cartItemRequestDto: CartRequestDto): Promise<boolean | undefined> {
        try {
            const res = await axiosInstance.post<ApiResponseDto>(`${this.endpoint}/items`, cartItemRequestDto)
            if (res.data.isSuccess) {
                return res.data.isSuccess
            }
            return false
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }

    async updateQuantityCartItem(cartItemRequestDto: CartUpdateRequestDtp): Promise<boolean | undefined> {
        try {
            const res = await axiosInstance.put<ApiResponseDto>(`${this.endpoint}/items`, cartItemRequestDto)
            if (res.data.isSuccess) {
                return res.data.isSuccess
            }
            return false
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }


    async deleteCartItem(variantId: number): Promise<boolean | undefined> {
        try {
            const res = await axiosInstance.delete<ApiResponseDto>(`${this.endpoint}/items/${variantId}`)
            if (res.data.isSuccess) {
                return res.data.isSuccess
            }
            return false
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }

    async deleteAll(): Promise<boolean | undefined> {
        try {
            const res = await axiosInstance.delete<ApiResponseDto>(this.endpoint)
            if (res.data.isSuccess) {
                return res.data.isSuccess
            }
            return false
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }
}