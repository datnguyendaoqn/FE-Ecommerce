import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    template: `
    <div class="relative bg-white rounded-2xl overflow-hidden">
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition z-10"
        (click)="onClose()"
      >
        <mat-icon class="!w-5 !h-5 !text-xl">close</mat-icon>
      </button>

      <!-- Dialog content -->
      <div class="p-8 text-center">
        <!-- Icon -->
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
          <mat-icon class="!w-12 !h-12 !text-5xl text-orange-500">lock_person</mat-icon>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold text-gray-900 mb-3">
          Yêu cầu đăng nhập
        </h2>

        <!-- Message -->
        <p class="text-gray-600 mb-8 leading-relaxed">
          Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.<br />
          Đăng nhập ngay để trải nghiệm mua sắm tốt nhất!
        </p>

        <!-- Action buttons -->
        <div class="flex gap-3 justify-center">
          <button
            class="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium transition-all"
            (click)="onClose()"
          >
            Đóng
          </button>
          <button
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:-translate-y-0.5 font-medium transition-all flex items-center gap-2"
            (click)="onLogin()"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host ::ng-deep .mat-mdc-dialog-container {
      border-radius: 1rem;
      padding: 0;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  `]
})
export class LoginDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<LoginDialogComponent>,
        private router: Router
    ) { }

    onClose(): void {
        this.dialogRef.close();
    }

    onLogin(): void {
        this.dialogRef.close();
        this.router.navigate(['/login']);
    }
}
