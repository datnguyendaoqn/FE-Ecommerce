import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SellerProductSummaryDto } from '@dtos/product/seller-product-summary.dto';
import { SellerProductService } from 'src/services/seller-product/seller-product.service';

@Component({
  selector: 'app-seller-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, CurrencyPipe],
  templateUrl: './product-list.html',
})
export class SellerProductListComponent implements OnInit {
  
  products = signal<SellerProductSummaryDto[]>([]);
  isLoading = signal(true);

  constructor(
    private sellerProductService: SellerProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.isLoading.set(true);
    try {
      const productList = await this.sellerProductService.getMyProducts();
      this.products.set(productList);
    } catch (error) {
      this.toastr.error(String(error), 'Lỗi tải sản phẩm');
    } finally {
      this.isLoading.set(false);
    }
  }

  onDeleteProduct(productId: number) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này? (Chưa cài đặt)')) {
      // TODO: Gọi service xóa khi API sẵn sàng
      // try {
      //   await this.sellerProductService.deleteProduct(productId);
      //   this.toastr.success('Xóa sản phẩm thành công');
      //   this.loadProducts(); // Tải lại danh sách
      // } catch (error) {
      //   this.toastr.error(String(error), 'Lỗi xóa sản phẩm');
      // }
      this.toastr.info('Chức năng xóa chưa được cài đặt', 'Thông báo');
    }
  }

  getStatusClass(status: string): string {
    if (status === 'active') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-gray-100 text-gray-700';
  }
}