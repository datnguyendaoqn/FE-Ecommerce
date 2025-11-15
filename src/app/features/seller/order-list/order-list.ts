import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/component/ui/confirm-dialog/confirm-dialog';
import { SellerService, SellerOrderDto, SellerOrderItemDto, OrderStatus } from 'src/services/seller/seller.service';


@Component({
  selector: 'app-seller-order-list',
  standalone: true,
  imports: [CommonModule, MatIcon, CurrencyPipe, MatDialogModule], 
  templateUrl: './order-list.html',
})
export class SellerOrderListComponent implements OnInit {
  
  activeTab = signal<OrderStatus>('Pending');
  
  filteredOrders = signal<SellerOrderDto[]>([]); 
  isLoading = signal(true); 

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sellerService: SellerService 
  ) {}

  ngOnInit() {
    this.loadOrders('Pending'); 
  }

  async loadOrders(status: OrderStatus) {
    this.activeTab.set(status);
    this.isLoading.set(true);
    this.filteredOrders.set([]); 

    try {
      const pageNumber = 1; 
      const response = await this.sellerService.getSellerOrders(status, pageNumber);

      this.filteredOrders.set(response.data.items); 

    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải đơn hàng');
    } finally {
      this.isLoading.set(false);
    }
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

    dialogRef.afterClosed().subscribe(async (result) => { 
      if (result === true) {
        this.isLoading.set(true);
        
        try {
          await this.sellerService.updateOrderStatus(orderId, newStatus);

          this.filteredOrders.update(orders => 
            orders.filter(order => order.orderId !== orderId)
          );
          this.toastr.success(`Đã cập nhật trạng thái đơn hàng #${orderId}.`);

        } catch (error) {
          this.toastr.error(String(error), 'Lỗi cập nhật trạng thái');
        } finally {
          this.isLoading.set(false);
        }
      }
    });
  }
}