import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { HelperService } from "src/helpers/hepler.service";
import { LoginApiResponseDto } from "@dtos/login/login.response.dto";
import { axiosInstance } from "src/configs/axiosInstance";
import { LoginRequestDto } from "@dtos/login/login.request.dto";
import { RegisterRequestDto } from "@dtos/register/register.request.dto";
import { RegisterResponseDto } from "@dtos/register/register.response.dto";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    endPoint: string
    constructor(
        protected readonly helper: HelperService,
        protected readonly logger: NGXLogger
    ) {
        this.endPoint = "/api/auth"
    }

    async login(loginRequestDto: LoginRequestDto): Promise<LoginApiResponseDto> {
        try {
            const res = await axiosInstance.post(`${this.endPoint}/login`, loginRequestDto)
            return res.data as LoginApiResponseDto
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }

    async registerOtp(email: string): Promise<void> {
        try {
            await axiosInstance.post(`${this.endPoint}/register-otp`, { email })
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }

    async registerAccount(registerRequestDto: RegisterRequestDto): Promise<RegisterResponseDto> {
        try {
            const res = await axiosInstance.post(`${this.endPoint}/register`, registerRequestDto)
            return res.data as RegisterResponseDto
        } catch (error) {
            throw this.helper.ThrowError(error)
        }
    }

}
