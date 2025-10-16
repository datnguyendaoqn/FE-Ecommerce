import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, MinLengthValidator } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OtpComponent } from '@shared/component/ui/otp-screen/otp-screen';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)]],
      rePassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)]],
      hoTen: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, rePassword } = this.form.value;

    if (rePassword !== password) {
      this.passwordsMatchValidator.set(false)
      return;
    } else {
      this.passwordsMatchValidator.set(true)
    }

    if (this.step() === 1) {
      this.openDialogOtp()
    }

    console.log('Đăng ký:', this.form.value);
  }

  openDialogOtp() {
    const email = this.form.get('email')?.value;

    this.dialog.open(OtpComponent, {
      width: '400px',
      disableClose: false, // ✅ Cho phép click ra ngoài để đóng
      autoFocus: false, // Giúp không bị auto focus nhảy lung tung
      data: { email },
    });
  }
}
