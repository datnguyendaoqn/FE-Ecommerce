import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from 'src/services/seller/seller.service';
import { sellerRegistrationRequestDto } from '@dtos/seller/seller.request.dto';

import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-seller-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SellerRegistrationComponent {

  constructor(
    private readonly sellerService: SellerService,
    private readonly toast: ToastrService,
    private readonly logger: NGXLogger,
    private readonly router: Router
  ) { }
  
  // === State ===
  loading = signal(false);
  error = signal<string | null>(null);

  // === Form ===
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
    description: new FormControl(''),
    bankAccountNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{9,14}$/)])
  });

  // === Logic ===
  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const dto = this.registerForm.value as sellerRegistrationRequestDto;

    try {
      await this.sellerService.register(dto);
      this.toast.success("Đăng ký seller thành công", 'Thành công');
      
      // Chuyển hướng đến trang seller/products
      this.router.navigate(['/seller/products']);
    } catch (error) {
      this.error.set(String(error));
      this.loading.set(false);
    }
  }
}