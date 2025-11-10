import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { BaseApiService } from '../api.service';
import { ProductSummaryDto } from '@dtos/product/product';
import { axiosInstance } from 'src/configs/axiosInstance';
import { ReviewApiResponseDto } from '@dtos/review/review';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseApiService<ProductSummaryDto, ProductSummaryDto> {
    constructor(helper: HelperService, logger: NGXLogger) {
        super('/product', helper, logger);
    }

    async getReviewProduct(productId: number) {
        try {
            const res = await axiosInstance.get<ReviewApiResponseDto>(`${this.endpoint}/${productId}/reviews`);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}
