import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { CustomerCancelOrderRequestDto } from "@dtos/order-customer/CustomerCancelOrder.request.dto";
import { CustomerOrderResponseDto, CustomerOrderItemDto } from "@dtos/order-customer/CustomerOrder.response.dto";
import { NGXLogger } from "ngx-logger";
import { CustomerOrderService } from "src/services/order-customer/order-customer.service";
import { ToastrService } from 'ngx-toastr';
import { ReviewDialogComponent, ReviewDialogData } from "@shared/component/ui/review-dialog/review-dialog";

interface Tab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-order-customer',
  standalone: true,
  imports: [FormsModule, CommonModule, DecimalPipe, RouterModule],
  templateUrl: './order-customer.html',
})
export class OrderCustomerComponent implements OnInit {

  orders: CustomerOrderResponseDto[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  activeTab: string = 'pending';
  
  // Track expanded orders
  expandedOrders: Set<number> = new Set();
  
  // Số sản phẩm hiển thị mặc định
  readonly DEFAULT_ITEMS_DISPLAY = 2;

  tabs: Tab[] = [
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đang vận chuyển', value: 'shipped' },
    { label: 'Hoàn tất', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' },
  ];

  constructor(
    private readonly orderService: CustomerOrderService,
    private readonly logger: NGXLogger,
    private readonly dialog: MatDialog,
    private readonly toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    try {
      const res = await this.orderService.getMyOrders();
      this.orders = res.data.items || [];
    } catch (err) {
      this.logger.error(err);
      this.toastr.error('Tải danh sách đơn hàng thất bại', 'Lỗi');
    } finally {
      this.isLoading = false;
    }
  }

  filteredOrders(): CustomerOrderResponseDto[] {
    return this.orders
      .filter(o => this.activeTab === 'all' || o.status?.toLowerCase() === this.activeTab)
      .filter(o =>
        !this.searchTerm ||
        o.shopName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.id.toString().includes(this.searchTerm) ||
        o.items?.some(i => i.productName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
  }

  // Lấy danh sách item hiển thị (có thể bị giới hạn)
  getDisplayedItems(order: CustomerOrderResponseDto): CustomerOrderItemDto[] {
    if (!order.items) return [];
    
    const isExpanded = this.expandedOrders.has(order.id);
    
    if (isExpanded || order.items.length <= this.DEFAULT_ITEMS_DISPLAY) {
      return order.items;
    }
    
    return order.items.slice(0, this.DEFAULT_ITEMS_DISPLAY);
  }

  // Kiểm tra có cần nút "Xem thêm" không
  shouldShowExpandButton(order: CustomerOrderResponseDto): boolean {
    return order.items && order.items.length > this.DEFAULT_ITEMS_DISPLAY;
  }

  // Toggle expand/collapse
  toggleExpandOrder(orderId: number): void {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  // Kiểm tra order có đang expand không
  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrders.has(orderId);
  }

  // Đếm số sản phẩm còn lại
  getRemainingItemsCount(order: CustomerOrderResponseDto): number {
    if (!order.items) return 0;
    return order.items.length - this.DEFAULT_ITEMS_DISPLAY;
  }

  setActiveTab(tabValue: string) {
    this.activeTab = tabValue;
  }

  getStatusText(status?: string): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'pending': return 'Chờ xác nhận';
      case 'shipped': return 'Đang vận chuyển';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  async confirmReceived(order: CustomerOrderResponseDto) {
    if (!order || order.status?.toLowerCase() !== 'shipped') return;

    try {
      await this.orderService.confirmDelivery(order.id);
      this.toastr.success('Xác nhận đã nhận hàng thành công', 'Thành công');
      await this.loadOrders();
    } catch (err) {
      this.logger.error(err);
      this.toastr.error('Xác nhận thất bại', 'Lỗi');
    }
  }

  handleReviewItem(order: CustomerOrderResponseDto, item: CustomerOrderItemDto) {
    const dialogData: ReviewDialogData = {
      orderItemId: item.id,
      productName: item.productName,
      productImageUrl: item.imageUrl || 'assets/images/default-product.png'
    };

    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '550px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.toastr.success(`Cảm ơn bạn đã đánh giá sản phẩm "${item.productName}"`, 'Hoàn tất');
      }
    });
  }

  async cancelOrder(order: CustomerOrderResponseDto) {
    if (!order || order.status?.toLowerCase() === 'cancelled') return;
    const reason = prompt('Vui lòng nhập lý do hủy đơn:');
    if (!reason) return;
    const cancelReq: CustomerCancelOrderRequestDto = { Reason: reason };
    try {
      await this.orderService.cancelOrder(order.id, cancelReq);
      this.toastr.success('Hủy đơn hàng thành công', 'Thành công');
      this.loadOrders();
    } catch (err) {
      this.logger.error(err);
      this.toastr.error('Hủy đơn hàng thất bại', 'Lỗi');
    }
  }

  handleBuyAgain(orderId: number) {
    this.toastr.info(`Chức năng mua lại đơn hàng #${orderId} đang được phát triển`, 'Thông báo');
  }

  handleRefund(orderId: number) {
    // TODO: Implement refund logic
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
  }
}