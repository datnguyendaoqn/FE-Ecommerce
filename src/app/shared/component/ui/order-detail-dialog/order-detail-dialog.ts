import { Component, Inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Dữ liệu item (sản phẩm) chung cho dialog
 */
export interface OrderDetailItemDto {
  productName: string;
  imageUrl: string;
  variantInfo: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Dữ liệu đầu vào chung cho dialog
 */
export interface OrderDetailDialogData {
  orderId: number;
  orderDate: string;
  customerName: string; // Tên người nhận
  phone: string;
  shippingAddress: string;
  status: string;
  totalAmount: number;
  items: OrderDetailItemDto[];
  shopName?: string; // Tên shop (chỉ dùng cho Customer)
}

@Component({
  selector: 'app-order-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIcon, MatButtonModule, CurrencyPipe],
  templateUrl: './order-detail-dialog.html',
})
export class OrderDetailDialogComponent {
  
  // Dùng signal để có thể cập nhật data sau (cho customer flow)
  data = signal<OrderDetailDialogData | null>(null);

  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) initialData: OrderDetailDialogData | null
  ) {
    if (initialData) {
      this.data.set(initialData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}