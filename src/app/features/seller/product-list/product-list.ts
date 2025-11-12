import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/component/ui/confirm-dialog/confirm-dialog';

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
    private toastr: ToastrService,
    private dialog: MatDialog 
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

  async onDeleteProduct(productId: number, productName: string) { 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Xác nhận Xóa Sản phẩm',
        message: `Bạn có chắc muốn XÓA sản phẩm:<br><b>"${productName}" (ID: ${productId})</b>?<br>Toàn bộ các biến thể của nó cũng sẽ bị xóa.`,
        confirmText: 'Đồng ý Xóa',
        cancelText: 'Hủy'
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result === true) { 
        try {
          await this.sellerProductService.deleteProduct(productId);
          this.toastr.success('Xóa sản phẩm thành công');
          this.loadProducts(); 
        } catch (error) {
          this.toastr.error(String(error), 'Lỗi xóa sản phẩm');
        }
      }
    });
  }

  getStatusClass(status: string): string {
    if (status === 'active') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-gray-100 text-gray-700';
  }
}