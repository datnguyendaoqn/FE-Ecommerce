import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './dashboard.html',
})
export class SellerDashboardComponent {
  stats = [
    {
      title: 'Doanh thu hôm nay',
      value: '1.200.000đ',
      icon: 'attach_money',
      color: 'bg-blue-500',
    },
    {
      title: 'Đơn hàng hôm nay',
      value: '15',
      icon: 'shopping_cart',
      color: 'bg-green-500',
    },
    {
      title: 'Sản phẩm hết hàng',
      value: '3',
      icon: 'warning',
      color: 'bg-red-500',
    },
    {
      title: 'Chờ xử lý',
      value: '5',
      icon: 'pending_actions',
      color: 'bg-orange-500',
    },
  ];
}