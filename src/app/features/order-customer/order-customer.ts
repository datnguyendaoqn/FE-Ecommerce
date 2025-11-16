import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";  
import { CustomerCancelOrderRequestDto } from "@dtos/order-customer/CustomerCancelOrder.request.dto";
import { CustomerOrderResponseDto } from "@dtos/order-customer/CustomerOrder.response.dto";
import { NGXLogger } from "ngx-logger";
import { CustomerOrderService } from "src/services/order-customer/order-customer.service";

interface Tab {
  label: string;
  value: string;
}
@Component({
    selector: 'app-order-customer',
    standalone: true,
    imports: [FormsModule, CommonModule,DecimalPipe,RouterModule ],
    templateUrl: './order-customer.html',
})
export class OrderCustomerComponent implements OnInit {

  orders: CustomerOrderResponseDto[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  activeTab: string = 'all';

  tabs: Tab[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xác nhận', value: 'pending' },
    { label: 'Đang vận chuyển', value: 'shipped' },
    { label: 'Hoàn tất', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' },
  ];

  constructor(
    private readonly orderService: CustomerOrderService,
    private readonly logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    try {
      const res = await this.orderService.getMyOrders();
      this.orders = res.data.items || [];
    } catch (err) {
      console.error(err);
      alert('Tải danh sách đơn hàng thất bại');
    } finally {
      this.isLoading = false;
    }
  }

  filteredOrders(): CustomerOrderResponseDto[] {
    return this.orders
      .filter(o => this.activeTab === 'all' || o.status.toLowerCase() === this.activeTab)
      .filter(o =>
        !this.searchTerm ||
        o.shopName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.id.toString().includes(this.searchTerm) ||
        o.items?.some(i => i.productName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
  }

  setActiveTab(tabValue: string) {
    this.activeTab = tabValue;
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'Chờ xác nhận';
      case 'shipped': return 'Đang vận chuyển';
      case 'completed': return 'Hoàn tất';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  async confirmReceived(order: CustomerOrderResponseDto) {
    if (!order || order.status.toLowerCase() !== 'shipped') return;
    try {
      await this.orderService.confirmDelivery(order.id);
      alert('Xác nhận đã nhận hàng thành công');
      this.loadOrders();
    } catch (err) {
      console.error(err);
      alert('Xác nhận thất bại');
    }
  }

  async cancelOrder(order: CustomerOrderResponseDto) {
    if (!order || order.status.toLowerCase() === 'cancelled') return;
    const reason = prompt('Vui lòng nhập lý do hủy đơn:');
    if (!reason) return;
    const cancelReq: CustomerCancelOrderRequestDto = {Reason:reason };
    try {
      await this.orderService.cancelOrder(order.id, cancelReq);
      alert('Hủy đơn hàng thành công');
      this.loadOrders();
    } catch (err) {
      console.error(err);
      alert('Hủy đơn hàng thất bại');
    }
  }

  handleReview(orderId: number) {
    alert(`Đi tới đánh giá cho đơn hàng #${orderId}`);
  }

  handleBuyAgain(orderId: number) {
    alert(`Mua lại đơn hàng #${orderId}`);
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
  }
}