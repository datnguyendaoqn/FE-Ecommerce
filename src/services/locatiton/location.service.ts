import { Injectable } from '@angular/core';
import { HelperService } from 'src/helpers/hepler.service';
import { NGXLogger } from 'ngx-logger';
import { axiosInstance } from 'src/configs/axiosInstance';
import { DistrictResponseDto, ProvinceResponseDto, WardResponseDto } from '@dtos/location/location.response.dto';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    endPoint: string = "/locations"
    constructor(private readonly helper: HelperService, private readonly logger: NGXLogger) {
    }


    async getProvinces() {
        try {
            const res = await axiosInstance.get<ProvinceResponseDto>(`${this.helper.getBaseUrl()}${this.endPoint}/provinces`);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async getDistricts(provinceCode: string) {
        try {
            console.log(`ProvinceCode: ${provinceCode}`)
            console.log(`url :${this.helper.getBaseUrl()}${this.endPoint}/districts`)
            const res = await axiosInstance.get<DistrictResponseDto>(`${this.helper.getBaseUrl()}${this.endPoint}/districts`, {
                params: {
                    provinceCode
                }
            });
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async getWards(districtCode: string) {
        try {
            const res = await axiosInstance.get<WardResponseDto>(`${this.helper.getBaseUrl()}${this.endPoint}/wards`, {
                params: {
                    districtCode
                }
            });
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}
