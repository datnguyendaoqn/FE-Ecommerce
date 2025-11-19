import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Interface dữ liệu nhận vào (Khớp với logic map ở component cha)
export interface OrderCustomerDetailDialogData {
  orderId: number;
  orderDate: Date;
  customerName: string;
  phone: string;
  shippingAddress: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;        // <--- Mới
  shippingNote?: string | null; // <--- Mới
  items: {
    productName: string;
    imageUrl: string;
    variantInfo: string;
    quantity: number;
    unitPrice: number;
  }[];
}

@Component({
  selector: 'app-order-customer-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, DecimalPipe, DatePipe],
  templateUrl: './order-customer-detail.html',
})
export class OrderCustomerDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderCustomerDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderCustomerDetailDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // Helper để chỉnh màu trạng thái
  getStatusColorClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('chờ') || s.includes('pending')) return 'bg-orange-100 text-orange-700';
    if (s.includes('vận chuyển') || s.includes('shipped')) return 'bg-blue-100 text-blue-700';
    if (s.includes('hoàn tất') || s.includes('completed')) return 'bg-green-100 text-green-700';
    if (s.includes('hủy') || s.includes('cancel')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  }
}