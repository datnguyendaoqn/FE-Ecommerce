import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CustomerOrderService } from 'src/services/order-customer/order-customer.service';
import { CustomerCancelOrderRequestDto } from '@dtos/order-customer/CustomerCancelOrder.request.dto';
import { CustomerOrderDetailResponseDto } from '@dtos/order-customer/CustomerOrderDetail.response';

@Component({
  selector: 'app-order-customer-detail',
  templateUrl: './order-customer-detail.html',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
})
export class OrderDetailComponent implements OnInit {

  order: CustomerOrderDetailResponseDto | null = null;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private customerOrderService: CustomerOrderService
  ) { }

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (orderId) {
      this.loadOrderDetail(orderId);
    } else {
      alert('Không tìm thấy ID đơn hàng.');
    }
  }

  async loadOrderDetail(orderId: number) {
    this.isLoading = true;
    try {
      this.order = await this.customerOrderService.getOrderDetail(orderId);
      this.logger.debug('Order loaded:', this.order);
    } catch (error) {
      console.error(error);
      alert('Lấy chi tiết đơn hàng thất bại.');
    } finally {
      this.isLoading = false;
    }
  }

  onCancelOrder(order: CustomerOrderDetailResponseDto) {
    const status = order.status?.toLowerCase();
    if (status === 'completed') {
      alert('Đơn hàng này đã được xác nhận nhận hàng, không thể hủy.');
      return;
    }

    const reason = prompt('Vui lòng nhập lý do hủy đơn:', '');
    if (!reason || reason.trim() === '') {
      alert('Bạn phải nhập lý do hủy đơn.');
      return;
    }

    this.isLoading = true;
    this.customerOrderService.cancelOrder(order.id, { reason: reason.trim() } as CustomerCancelOrderRequestDto)
      .then(() => {
        alert('Hủy đơn thành công!');
        this.loadOrderDetail(order.id);
      })
      .catch(err => {
        console.error(err);
        alert('Hủy đơn thất bại');
      })
      .finally(() => this.isLoading = false);
  }

  onConfirmDelivery(order: CustomerOrderDetailResponseDto) {
    const status = order.status?.toLowerCase();

    if (status !== 'shipped') {
      alert('Bạn chỉ có thể xác nhận khi đơn hàng ở trạng thái "Shipped".');
      return;
    }

    this.isLoading = true;
    this.customerOrderService.confirmDelivery(order.id)
      .then(() => {
        alert('Xác nhận đã nhận hàng thành công!');
        this.loadOrderDetail(order.id);
      })
      .catch(err => {
        console.error(err);
        alert('Xác nhận thất bại');
      })
      .finally(() => this.isLoading = false);
  }
}
