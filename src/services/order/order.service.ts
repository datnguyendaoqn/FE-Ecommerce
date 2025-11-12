import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { BaseApiService } from '../api.service';
import { OrderRequestDto } from '@dtos/order/order.request.dto';
import { OrderResponseDto } from '@dtos/order/order.response.dto';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends BaseApiService<OrderRequestDto, OrderResponseDto> {
    constructor(helper: HelperService, logger: NGXLogger) {
        super('/orders', helper, logger);
    }
}
