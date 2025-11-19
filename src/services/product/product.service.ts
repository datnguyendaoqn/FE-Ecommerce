import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { BaseApiService } from '../api.service';
import { ProductRelatedPaginationDto, ProductSummaryDto } from '@dtos/product/product';
import { axiosInstance } from 'src/configs/axiosInstance';
import { ReviewApiResponseDto } from '@dtos/review/review';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseApiService<ProductSummaryDto, ProductSummaryDto> {
    constructor(helper: HelperService, logger: NGXLogger) {
        super('/products', helper, logger);
    }

    async getReviewProduct(productId: number) {
        try {
            const res = await axiosInstance.get<ReviewApiResponseDto>(`${this.endpoint}/${productId}/reviews`);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async getRelatedProduct(productId: number) {
        try {
            const res = await axiosInstance.get<ProductRelatedPaginationDto>(`${this.endpoint}/${productId}/related`);
            return res.data.data.sameShopProducts;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async getTop5Product(): Promise<ProductSummaryDto[]> {
        try {
            const res = await axiosInstance.get(`${this.endpoint}/featured-bestsellers`);
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}
