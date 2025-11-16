import { Component, OnInit } from '@angular/core';
import { Order } from '@dtos/order-customer/order-customer.response.dto';
import { OrderStatus } from '@dtos/order-customer/order-customer.enum';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { OrderCustomerService } from 'src/services/order-customer/order-customer.service';
import { Router } from '@angular/router';
interface Tab {
    label: string;
    value: 'all' | OrderStatus;
}
@Component({
    selector: 'app-order-customer',
    standalone: true,
    imports: [FormsModule, CommonModule,DecimalPipe],
    templateUrl: './order-customer.html',
})
export class OrderCustomerComponent implements OnInit {
    tabs: Tab[] = [
        { label: 'Tất cả', value: 'all' },
        { label: 'Chờ xác nhận', value: OrderStatus.PENDING_CONFIRMATION },
        { label: 'Vận chuyển', value: OrderStatus.SHIPPED },
        { label: 'Hoàn thành', value: OrderStatus.COMPLETED },
        { label: 'Đã hủy', value: OrderStatus.CANCELLED },
    ];

    activeTab: 'all' | OrderStatus = 'all';
    orders: Order[] = [];
    searchTerm: string = '';
    isLoading = false;

    constructor(private orderService: OrderCustomerService, private router: Router) { }

    ngOnInit() {
        this.loadOrders('all');
    }

    async setActiveTab(tab: 'all' | OrderStatus) {
        this.activeTab = tab;
        await this.loadOrders(tab);
    }

    async loadOrders(status: 'all' | OrderStatus) {
        this.isLoading = true;
        try {
            this.orders = await this.orderService.getOrders(status);
        } catch (err) {
            this.orders = [];
        } finally {
            this.isLoading = false;
        }
    }

    filteredOrders(): Order[] {
        if (this.activeTab === 'all') return this.orders;
        return this.orders.filter((o) => o.status === this.activeTab);
    }

    getStatusText(status: OrderStatus | string) {
        switch (status) {
            case OrderStatus.PENDING_CONFIRMATION:
                return 'Chờ xác nhận';
            case OrderStatus.SHIPPED:
                return 'Đang vận chuyển';
            case OrderStatus.COMPLETED:
                return 'Hoàn thành';
            case OrderStatus.CANCELLED:
                return 'Đã hủy';
            default:
                return status;
        }
    }
    openOrderDetail(orderId: number) {
        this.router.navigate(['/order-customer', orderId]);
    }

    confirmReceived(order: Order) {
        this.orderService.updateOrderStatus(order.id, OrderStatus.COMPLETED)
            .then(updated => {
                order.status = updated.status;
                order.statusText = updated.statusText;
            })
            .catch(err => console.error(err));
    }

    async onSearchChange(term: string) {
        this.searchTerm = term;
        await this.loadOrders(this.activeTab);
    }

    async handleBuyAgain(orderId: number) {
        await this.orderService.buyAgain(orderId);
        alert(`Yêu cầu mua lại đơn ${orderId} thành công`);
    }

    async handleReview(orderId: number) {
        await this.orderService.reviewOrder(orderId);
        alert(`Điều hướng đánh giá đơn ${orderId}`);
    }
}
