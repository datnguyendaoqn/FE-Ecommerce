import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { BaseApiService } from '../api.service';
import { axiosInstance } from 'src/configs/axiosInstance';
import { ReviewApiResponseDto } from '@dtos/review/review';
import { ReviewRequestDto } from '@dtos/review/review.request.dto';

@Injectable({
    providedIn: 'root',
})
export class ReviewService extends BaseApiService<ReviewRequestDto, ReviewApiResponseDto> {
    constructor(helper: HelperService, logger: NGXLogger) {
        super('/reviews', helper, logger);
    }


}
