import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderCustomerService } from 'src/services/order-customer/order-customer.service';
import { Order } from '@dtos/order-customer/order-customer.response.dto';
import { DecimalPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-customer-detail',
  templateUrl: './order-customer-detail.html',
    standalone: true,
    imports: [DecimalPipe, CommonModule],
})
export class OrderCustomerDetailComponent implements OnInit {

  order?: Order;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderCustomerService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.orderService.getOrderById(id).then(res => {
      this.order = res;
      this.isLoading = false;
    });
  }
}
