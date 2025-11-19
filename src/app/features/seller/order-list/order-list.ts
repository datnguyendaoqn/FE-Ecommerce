import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/component/ui/confirm-dialog/confirm-dialog';
import { OrderStatus, SellerOrderDto } from '@dtos/order/order';
import { SellerService } from 'src/services/seller/seller.service';
import {
  OrderDetailDialogComponent,
  OrderDetailDialogData
} from '@shared/component/ui/order-detail-dialog/order-detail-dialog';

@Component({
  selector: 'app-seller-order-list',
  standalone: true,
  imports: [CommonModule, MatIcon, CurrencyPipe, MatDialogModule],
  templateUrl: './order-list.html',
})
export class SellerOrderListComponent implements OnInit {

  // Tab đang chọn
  activeTab = signal<OrderStatus>('Pending');

  // Dữ liệu toàn bộ đơn hàng (dùng để phân trang)
  allOrders = signal<SellerOrderDto[]>([]);

  // Dữ liệu hiển thị của trang hiện tại
  filteredOrders = signal<SellerOrderDto[]>([]);

  // Loading
  isLoading = signal(true);

  // Phân trang
  currentPage = signal(1);
  pageSize = 3;

  // Số sản phẩm hiển thị mặc định mỗi đơn
  readonly DEFAULT_ITEMS_DISPLAY = 2;

  // List order đang expand
  expandedOrders = new Set<number>();

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sellerService: SellerService
  ) { }

  ngOnInit() {
    this.loadOrders('Pending');
  }

  //----------------------------------------------------
  // Tải đơn hàng
  //----------------------------------------------------
  async loadOrders(status: OrderStatus) {
    this.activeTab.set(status);
    this.isLoading.set(true);

    this.allOrders.set([]);
    this.filteredOrders.set([]);
    this.currentPage.set(1);

    try {
      const pageNumber = 1;
      const response = await this.sellerService.getSellerOrders(status, pageNumber);

      // Lưu toàn bộ
      this.allOrders.set(response.data.items);

      // Lọc trang đầu tiên
      this.filteredOrders.set(this.getPaginatedOrders());

    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải đơn hàng');
    } finally {
      this.isLoading.set(false);
    }
  }

  //----------------------------------------------------
  // Phân trang
  //----------------------------------------------------
  totalPages() {
    return Math.ceil(this.allOrders().length / this.pageSize);
  }

  getPaginatedOrders() {
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.allOrders().slice(start, end);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(v => v + 1);
      this.filteredOrders.set(this.getPaginatedOrders());
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(v => v - 1);
      this.filteredOrders.set(this.getPaginatedOrders());
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.filteredOrders.set(this.getPaginatedOrders());
  }

  pageNumbers() {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 1;

    const pages = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }

    return pages;
  }

  displayInfo() {
    const total = this.allOrders().length;
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return { start, end, total };
  }

  //----------------------------------------------------
  // Hiển thị item của từng đơn
  //----------------------------------------------------
  getDisplayedItems(order: SellerOrderDto) {
    if (!order.items) return [];

    const isExpanded = this.expandedOrders.has(order.orderId);

    if (isExpanded || order.items.length <= this.DEFAULT_ITEMS_DISPLAY) {
      return order.items;
    }

    return order.items.slice(0, this.DEFAULT_ITEMS_DISPLAY);
  }

  shouldShowExpandButton(order: SellerOrderDto): boolean {
    return order.items && order.items.length > this.DEFAULT_ITEMS_DISPLAY;
  }

  toggleExpandOrder(orderId: number, event?: Event) {
    // Ngăn sự kiện click lan truyền
    if (event) {
      event.stopPropagation();
    }

    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrders.has(orderId);
  }

  getRemainingItemsCount(order: SellerOrderDto) {
    if (!order.items) return 0;
    return order.items.length - this.DEFAULT_ITEMS_DISPLAY;
  }

  //----------------------------------------------------
  // Cập nhật trạng thái đơn hàng
  //----------------------------------------------------
  handleUpdateStatus(orderId: number, newStatus: OrderStatus, event?: Event) {
    // Ngăn sự kiện click lan truyền
    if (event) {
      event.stopPropagation();
    }

    let title = '';
    let message = '';
    let confirmText = '';

    if (newStatus === 'processing') {
      title = 'Xác nhận Chuẩn bị hàng';
      message = `Bạn có chắc muốn bắt đầu chuẩn bị đơn hàng <b>#${orderId}</b>?`;
      confirmText = 'Xác nhận';
    }
    else if (newStatus === 'shipped') {
      title = 'Xác nhận Giao hàng';
      message = `Bạn có chắc đã bàn giao đơn hàng <b>#${orderId}</b> cho đơn vị vận chuyển?`;
      confirmText = 'Xác nhận Giao';
    }
    else if (newStatus === 'completed') {
      title = 'Xác nhận Hoàn thành';
      message = `Bạn có chắc đơn hàng <b>#${orderId}</b> đã giao thành công?`;
      confirmText = 'Đã hoàn thành';
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      restoreFocus: false,
      data: { title, message, confirmText }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) {
        this.isLoading.set(true);

        try {
          await this.sellerService.updateOrderStatus(orderId, newStatus);

          // Xóa đơn này khỏi danh sách đang hiển thị
          this.allOrders.update(orders =>
            orders.filter(order => order.orderId !== orderId)
          );

          this.filteredOrders.set(this.getPaginatedOrders());

          this.toastr.success(`Đã cập nhật trạng thái đơn hàng #${orderId}.`);

        } catch (error) {
          this.toastr.error(String(error), 'Lỗi cập nhật trạng thái');
        } finally {
          this.isLoading.set(false);
        }
      }
    });
  }

  //----------------------------------------------------
  // Mở popup xem chi tiết
  //----------------------------------------------------
  openDetailDialog(order: SellerOrderDto): void {
    const dialogData: OrderDetailDialogData = {
      orderId: order.orderId,
      orderDate: order.orderDate,
      customerName: order.customerName,
      phone: order.phone,
      shippingAddress: order.shippingAddress,
      status: this.getSellerStatusText(order.status),
      totalAmount: order.totalAmountForSeller,
      items: order.items.map(item => ({
        productName: item.productName,
        imageUrl: item.imageUrl,
        variantInfo: item.variantInfo,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    this.dialog.open(OrderDetailDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: dialogData
    });
  }

  //----------------------------------------------------
  // Hiển thị text trạng thái
  //----------------------------------------------------
  getSellerStatusText(status: OrderStatus | string): string {
    switch (status) {
      case 'Pending': return 'Chờ xác nhận';
      case 'processing': return 'Đang chuẩn bị';
      case 'shipped': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}