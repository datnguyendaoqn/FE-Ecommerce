import { ApiResponseDto } from "@dtos/api/api.response.dto";
import { IDistrict, IProvince, IWard } from "./location";

export interface ProvinceResponseDto extends ApiResponseDto {
    data: IProvince[]
}

export interface DistrictResponseDto extends ApiResponseDto {
    data: IDistrict[]
}

export interface WardResponseDto extends ApiResponseDto {
    data: IWard[]
}