import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { BaseApiService } from '../api.service';
import { ProductSummaryDto } from '@dtos/product/product';
import { axiosInstance } from 'src/configs/axiosInstance';
import { ReviewApiResponseDto } from '@dtos/review/review';
import { AddressBooksRequestDto } from '@dtos/address-books/address-books.request.dto';
import { AddressBooksResponseDto } from '@dtos/address-books/adress-books.response.dto';
import { AddressBooks } from '@dtos/address-books/address-books';

@Injectable({
    providedIn: 'root',
})
export class AddressBooksSerivce extends BaseApiService<AddressBooksRequestDto, AddressBooks> {
    constructor(helper: HelperService, logger: NGXLogger) {
        super('/addresses', helper, logger);
    }


    async setAddressBookDefault(addressBookId: number) {
        try {
            const res = await axiosInstance.put<ReviewApiResponseDto>(`${this.endpoint}/${addressBookId}/set-default`);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}
