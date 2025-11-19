import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface CancelOrderDialogData {
  orderId: number;
  shopName: string;
}

export interface CancelOrderDialogResult {
  confirmed: boolean;
  reason?: string;
}

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="cancel-order-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <h2 class="dialog-title">Hủy đơn hàng</h2>
        <button 
          type="button" 
          class="close-button" 
          (click)="onCancel()"
          aria-label="Đóng"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="dialog-content">
        <!-- Order Info -->
        <div class="order-info">
          <div class="info-row">
            <span class="label">Mã đơn hàng:</span>
            <span class="value">#{{ data.orderId }}</span>
          </div>
          <div class="info-row">
            <span class="label">Shop:</span>
            <span class="value">{{ data.shopName }}</span>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="warning-box">
          <svg class="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
            </path>
          </svg>
          <div class="warning-text">
            <p class="warning-title">Lưu ý khi hủy đơn hàng</p>
            <p class="warning-description">
              Sau khi hủy, đơn hàng sẽ không thể khôi phục. Vui lòng cho chúng tôi biết lý do để cải thiện dịch vụ.
            </p>
          </div>
        </div>

        <!-- Reason Selection -->
        <div class="reason-section">
          <label class="section-label">
            Lý do hủy đơn <span class="required">*</span>
          </label>
          
          <!-- Predefined Reasons -->
          <div class="reason-options">
            <label 
              *ngFor="let option of reasonOptions" 
              class="reason-option"
              [class.selected]="selectedReason === option"
            >
              <input 
                type="radio" 
                name="reason" 
                [value]="option"
                [(ngModel)]="selectedReason"
                class="radio-input"
              />
              <span class="radio-label">{{ option }}</span>
            </label>
          </div>

          <!-- Custom Reason Input -->
          <div *ngIf="selectedReason === 'Khác'" class="custom-reason-container">
            <textarea
              [(ngModel)]="customReason"
              placeholder="Vui lòng nhập lý do cụ thể..."
              class="custom-reason-input"
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ customReason.length }}/500</div>
          </div>

          <!-- Error Message -->
          <p *ngIf="showError" class="error-message">
            Vui lòng chọn lý do hủy đơn hàng
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          (click)="onCancel()"
        >
          Không, giữ đơn hàng
        </button>
        <button 
          type="button" 
          class="btn btn-danger" 
          (click)="onConfirm()"
        >
          Xác nhận hủy
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cancel-order-dialog {
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .close-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #6b7280;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-button:hover {
      background-color: #f3f4f6;
      color: #111827;
    }

    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .order-info {
      background: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }

    .info-row .label {
      color: #6b7280;
      font-size: 14px;
    }

    .info-row .value {
      color: #111827;
      font-weight: 500;
      font-size: 14px;
    }

    .warning-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .warning-icon {
      width: 24px;
      height: 24px;
      color: #f59e0b;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .warning-text {
      flex: 1;
    }

    .warning-title {
      font-weight: 600;
      color: #92400e;
      font-size: 14px;
      margin: 0 0 4px 0;
    }

    .warning-description {
      color: #78350f;
      font-size: 13px;
      margin: 0;
      line-height: 1.5;
    }

    .reason-section {
      margin-top: 8px;
    }

    .section-label {
      display: block;
      font-weight: 500;
      color: #374151;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .required {
      color: #dc2626;
    }

    .reason-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .reason-option {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .reason-option:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }

    .reason-option.selected {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .radio-input {
      margin: 0 12px 0 0;
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #3b82f6;
    }

    .radio-label {
      color: #374151;
      font-size: 14px;
      cursor: pointer;
      flex: 1;
    }

    .custom-reason-container {
      margin-top: 12px;
      position: relative;
    }

    .custom-reason-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.2s;
    }

    .custom-reason-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .char-count {
      text-align: right;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }

    .error-message {
      color: #dc2626;
      font-size: 13px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-secondary {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .btn-danger {
      background: #dc2626;
      color: white;
    }

    .btn-danger:hover {
      background: #b91c1c;
    }

    .btn:active {
      transform: scale(0.98);
    }

    /* Scrollbar Styling */
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }
  `]
})
export class CancelOrderDialogComponent {
  selectedReason: string = '';
  customReason: string = '';
  showError: boolean = false;

  reasonOptions: string[] = [
    'Tôi muốn thay đổi địa chỉ giao hàng',
    'Tôi tìm thấy giá rẻ hơn ở nơi khác',
    'Thời gian giao hàng quá lâu',
    'Đổi ý, không muốn mua nữa',
    'Đặt nhầm sản phẩm',
    'Khác'
  ];

  constructor(
    public dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CancelOrderDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

  onConfirm(): void {
    // Validate
    if (!this.selectedReason) {
      this.showError = true;
      return;
    }

    if (this.selectedReason === 'Khác' && !this.customReason.trim()) {
      this.showError = true;
      return;
    }

    const finalReason = this.selectedReason === 'Khác' 
      ? this.customReason.trim() 
      : this.selectedReason;

    this.dialogRef.close({ 
      confirmed: true, 
      reason: finalReason 
    });
  }
}