import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OtpComponent } from '@shared/component/ui/otp-screen/otp-screen';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/services/auth/auth.service';
import { LoggerService } from 'src/configs/logger.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  showPassword = signal(false);
  showRePassword = signal(false);
  passwordsMatchValidator = signal(true);
  step = signal(1);

  form!: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private authService: AuthService, private logger: LoggerService, private toast: ToastrService) {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(/^\S+$/),
        ],
      ], password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)]],
      rePassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)]],
      fullName: ['', [Validators.required, Validators.minLength(4)]],
    });
  }



  async onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, rePassword, email } = this.form.value;

    if (rePassword !== password) {
      this.passwordsMatchValidator.set(false)
      return;
    } else {
      this.passwordsMatchValidator.set(true)
    }

    if (this.step() === 1) {
      this.logger.debug("Gửi mã otp đén email: ", email)
      try {
        await this.authService.registerOtp(email)
        this.openDialogOtp()
      } catch (error) {
        this.toast.error(String(error), "Lỗi")
      }
    }

  }

  openDialogOtp() {
    const dataRegister = this.form.value;

    this.dialog.open(OtpComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: false,
      data: {
        email: dataRegister.email,
        type: 'REGISTER_ACCOUNT',
        service: this.authService,
        data: dataRegister,
      },
    });
  }

}
