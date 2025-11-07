import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface LoginResponseDto {
    fullName:string,
    role: string,
    id:string,
    accessToken: string;
    refreshToken: string;
}

export interface LoginApiResponseDto extends ApiResponseDto {
    data: LoginResponseDto
}