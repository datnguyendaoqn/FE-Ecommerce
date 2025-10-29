import { RegisterRequestDto } from '@dtos/register/register.request.dto';
import { AuthService } from 'src/services/auth/auth.service';

export type TypeOtp = 'REGISTERACCOUNT' | 'RESET_PASSWORD' | 'LOGIN_2FA';

export type OtpDialogData =
    | {
        type: 'REGISTER_ACCOUNT';
        email: string;
        data: RegisterRequestDto;
        service: AuthService
    }
    | {
        type: 'RESET_PASSWORD';
        email: string;
        service: AuthService

    }

