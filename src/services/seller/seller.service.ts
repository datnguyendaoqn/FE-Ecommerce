import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { HelperService } from "src/helpers/hepler.service";
import { axiosInstance } from "src/configs/axiosInstance";
import { SellerRegistrationResponseDto } from "@dtos/seller/seller.response.dto";
import { sellerRegistrationRequestDto } from "@dtos/seller/seller.request.dto";

@Injectable({
    providedIn: "root",
})
export class SellerService {
    endPoint: string = "http://localhost:8080/api/sellers";

    constructor(
        private readonly helper: HelperService,
        private readonly logger: NGXLogger
    ) {
    }

    async register(sellerRequestDto: sellerRegistrationRequestDto): Promise<SellerRegistrationResponseDto> {
        this.logger.debug(`endPoint: ${this.endPoint}/registration`);
        try {
            const res = await axiosInstance.post(`${this.endPoint}/registration`, sellerRequestDto);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

}