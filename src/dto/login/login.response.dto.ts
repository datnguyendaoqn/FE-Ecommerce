import { ApiResponseDto } from "@dtos/api/api.response.dto";

export interface LoginResponseDto {
    user: { name: string; email: string } | null;
    accessToken: string;
    refreshToken: string;
}

export interface LoginApiResponseDto extends ApiResponseDto {
    data: LoginResponseDto
}