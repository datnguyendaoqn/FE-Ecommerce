import { Component, signal, effect, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OtpDialogData } from './otp-dialog-data';
import { NGXLogger } from 'ngx-logger';
import { LoggerService } from 'src/configs/logger.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp-screen.html',
})
export class OtpComponent {
  // Input từ component cha
  email = signal('');
  private data = inject<OtpDialogData>(MAT_DIALOG_DATA);
  type = signal<'REGISTER_ACCOUNT' | 'RESET_PASSWORD'>('REGISTER_ACCOUNT');


  // Output events
  onVerifySuccess = output<string>();
  onVerifyError = output<string>();
  onResendSuccess = output<void>();

  otpDigits = signal<string[]>(['', '', '', '', '', '']);
  canResend = signal<boolean>(false);
  countdown = signal<number>(60);
  isVerifying = signal<boolean>(false);
  private countdownInterval: any;

  constructor(private logger: LoggerService, private toast: ToastrService) {
    effect(() => {
      if (this.countdown() === 0) {
        this.canResend.set(true);
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
      }
    });
  }

  ngOnInit() {
    if (this.data?.email) {
      (this.email).set?.(this.data.email);
    }
    this.startCountdown();
    // Auto focus vào ô đầu tiên
    setTimeout(() => {
      const firstInput = document.querySelector('.otp-input') as HTMLInputElement;
      firstInput?.focus();
    }, 100);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Chỉ cho phép nhập số
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      this.updateOtpDigit(index, '');
      return;
    }

    this.updateOtpDigit(index, value);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Auto verify khi nhập đủ 6 số
    if (this.isOtpComplete()) {
      setTimeout(() => this.verifyOtp(), 300);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    // Xử lý phím Backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }

    // Xử lý phím mũi tên
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }

    if (event.key === 'ArrowRight' && index < 5) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    // Enter để verify
    if (event.key === 'Enter' && this.isOtpComplete()) {
      this.verifyOtp();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const newDigits = pastedData.split('');
      this.otpDigits.set(newDigits);

      // Focus vào ô cuối cùng
      setTimeout(() => {
        const inputs = document.querySelectorAll('.otp-input');
        (inputs[5] as HTMLInputElement)?.focus();
      });

      // Auto verify
      setTimeout(() => this.verifyOtp(), 300);
    }
  }

  updateOtpDigit(index: number, value: string) {
    const current = [...this.otpDigits()];
    current[index] = value;
    this.otpDigits.set(current);
  }

  startCountdown() {
    this.countdown.set(60);
    this.canResend.set(false);

    this.countdownInterval = setInterval(() => {
      this.countdown.update(val => val - 1);
    }, 1000);
  }

  async resendOtp() {
    if (this.canResend() && !this.isVerifying()) {
      try {
        if (this.data.type === 'REGISTER_ACCOUNT') {
          // * Gửi lại mã otp
          this.data.service.registerOtp(this.data.email)
        } else if (this.data.type === 'RESET_PASSWORD') {
          this.data.service.registerOtp(this.data.email)
        }
        console.log('Resending OTP to email:', this.email());
        this.otpDigits.set(['', '', '', '', '', '']);
        this.startCountdown();
        this.onResendSuccess.emit();

        // Focus vào ô đầu tiên
        setTimeout(() => {
          const firstInput = document.querySelector('.otp-input') as HTMLInputElement;
          firstInput?.focus();
        }, 100);
      } catch (error) {
        console.error('Resend OTP error:', error);
      }
    }
  }

  async verifyOtp() {
    const otp = this.otpDigits().join('');
    if (otp.length !== 6 || this.isVerifying()) return;

    this.isVerifying.set(true);
    try {
      this.logger.debug('Verifying OTP:', otp, 'for email:', this.email(), 'type:', this.type());

      if (this.data.type === 'REGISTER_ACCOUNT') {
        const registerRequest = {
          ...this.data.data,
          otp: otp
        }
        // * Đăng ký account
        try {
          const registerRes = await this.data.service.registerAccount(registerRequest)
          if (registerRes?.isSuccess) {
            this.toast.success("Đăng nhập để tiếp tục", "Đăng ký thành công")
            window.location.href = "/login"
          }
        } catch (error) {
          this.toast.error(String(error), "Lỗi")

        }

      } else if (this.data.type === 'RESET_PASSWORD') {
        // Gọi API reset mật khẩu
      }
      await new Promise(resolve => setTimeout(resolve, 800));
      this.onVerifySuccess.emit(otp);
    } catch (err: any) {
      this.logger.error(err);
      this.onVerifyError.emit(err.message || 'Lỗi xác thực OTP');
      this.otpDigits.set(['', '', '', '', '', '']);
    } finally {
      this.isVerifying.set(false);
    }
  }

  getOtpValue(): string {
    return this.otpDigits().join('');
  }

  isOtpComplete(): boolean {
    return this.otpDigits().every(digit => digit !== '');
  }

  getMaskedEmail(): string {
    const email = this.email();
    const [local, domain] = email.split('@');
    if (local.length <= 3) {
      return `${local[0]}***@${domain}`;
    }
    return `${local.substring(0, 3)}***@${domain}`;
  }
}