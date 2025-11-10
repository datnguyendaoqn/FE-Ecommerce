import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { BaseApiService } from '../api.service';
import { ProductSummaryDto } from '@dtos/product/product';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseApiService<ProductSummaryDto, ProductSummaryDto> {
    constructor(helper: HelperService, logger: NGXLogger) {
        super('/product', helper, logger);
    }
}
