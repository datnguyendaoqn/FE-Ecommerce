import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/component/ui/confirm-dialog/confirm-dialog';

interface SellerOrderItemDto {
  productName: string;
  imageUrl: string;
  variantInfo: string; 
  quantity: number;
  unitPrice: number;
}
interface SellerOrderDto {
  orderId: number;
  customerName: string; 
  phone: string; 
  shippingAddress: string;
  orderDate: string;
  status: 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';
  totalAmountForSeller: number;
  items: SellerOrderItemDto[];
}
const MOCK_ORDERS: SellerOrderDto[] = [
  { 
    orderId: 101, customerName: 'Nguyễn Văn A', phone: '090xxxx123', 
    shippingAddress: 'P. Bến Nghé, Q.1, TP. Hồ Chí Minh',
    status: 'Pending', totalAmountForSeller: 350000, orderDate: '2025-11-10T10:30:00Z',
    items: [
      { productName: 'Bộ Vest Nữ Công Sở (Hàng shop)', quantity: 1, unitPrice: 350000, imageUrl: 'assets/images/banner-1.jpg', variantInfo: 'Xanh Mint, M' }
    ] 
  },
  { 
    orderId: 102, customerName: 'Trần Thị B', phone: '090xxxx456', 
    shippingAddress: 'P. Dịch Vọng, Q. Cầu Giấy, Hà Nội',
    status: 'Pending', totalAmountForSeller: 450000, orderDate: '2025-11-11T14:00:00Z',
    items: [
      { productName: 'BST Áo Sơ Mi Công Sở (Hàng shop)', quantity: 2, unitPrice: 225000, imageUrl: 'assets/images/banner-2.jpg', variantInfo: 'Xanh, L' }
    ] 
  },
  { 
    orderId: 103, customerName: 'Lê Văn C', phone: '090xxxx789', 
    shippingAddress: 'P. Hải Châu I, Q. Hải Châu, Đà Nẵng',
    status: 'Shipping', totalAmountForSeller: 199000, orderDate: '2025-11-09T09:00:00Z',
    items: [
      { productName: 'Áo Thun Nữ Năng Động (Hàng shop)', quantity: 1, unitPrice: 199000, imageUrl: 'assets/images/banner-3.jpg', variantInfo: 'Vàng, S' }
    ] 
  },
  { 
    orderId: 104, customerName: 'Phạm Thị D', phone: '090xxxx999', 
    shippingAddress: 'P. Nại Hiên, Q. Sơn Trà, Đà Nẵng',
    status: 'Completed', totalAmountForSeller: 500000, orderDate: '2025-11-08T18:00:00Z',
    items: [
      { productName: 'Bộ Vest Nữ Công Sở (Hàng shop)', quantity: 1, unitPrice: 500000, imageUrl: 'assets/images/banner-1.jpg', variantInfo: 'Hồng, XL' }
    ] 
  },
];

type OrderStatus = 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';

@Component({
  selector: 'app-seller-order-list',
  standalone: true,
  imports: [CommonModule, MatIcon, CurrencyPipe, DatePipe, MatDialogModule],
  templateUrl: './order-list.html',
})
export class SellerOrderListComponent implements OnInit {
  
  activeTab = signal<OrderStatus>('Pending');
  allOrders = signal<SellerOrderDto[]>(MOCK_ORDERS); 
  filteredOrders = signal<SellerOrderDto[]>([]); 
  isLoading = signal(false);

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadOrders('Pending');
  }

  loadOrders(status: OrderStatus) {
    this.activeTab.set(status);
    this.isLoading.set(true);

    setTimeout(() => {
      try {
        const data = this.allOrders().filter(o => o.status === status);
        this.filteredOrders.set(data);
      } catch (error) {
        this.toastr.error(String(error), 'Lỗi tải đơn hàng');
      } finally {
        this.isLoading.set(false);
      }
    }, 300); 
  }

  handleUpdateStatus(orderId: number, newStatus: OrderStatus) {
    let title = '';
    let message = '';
    let confirmText = '';

    if (newStatus === 'Shipping') {
      title = 'Xác nhận Giao hàng';
      message = `Bạn có chắc muốn xác nhận và bắt đầu giao đơn hàng <b>#${orderId}</b>?`;
      confirmText = 'Xác nhận Giao';
    } else if (newStatus === 'Completed') {
      title = 'Xác nhận Hoàn thành';
      message = `Bạn có chắc đơn hàng <b>#${orderId}</b> đã giao thành công?`;
      confirmText = 'Đã hoàn thành';
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { title, message, confirmText }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.isLoading.set(true);

        this.allOrders.update(orders => 
          orders.map(order => 
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
        this.toastr.success(`Đã cập nhật trạng thái đơn hàng #${orderId}.`);

        this.loadOrders(this.activeTab());
        // ------------------------------
        
        this.isLoading.set(false);
      }
    });
  }
}