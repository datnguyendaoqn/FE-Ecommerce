import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatIcon } from '@angular/material/icon';
import { LoggerService } from 'src/configs/logger.service';
import { ProductCardComponent } from '@shared/component/ui/product/product';
import { ProductSummaryDto } from '@dtos/product/product';
import { ProductService } from 'src/services/product/product.service';
import { productsMock } from 'src/data/product.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselModule, MatIcon, ProductCardComponent],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly productService: ProductService
  ) {}

  Math = Math;

  slides = [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    'https://images.unsplash.com/photo-1521334884684-d80222895322',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
  ];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    dots: false,
    autoplayTimeout: 3000,
    items: 1,
  };

  products: ProductSummaryDto[] = [];
  loading = false;
  page = 1;
  pageSize = 8;

  async ngOnInit() {
    await this.fetchProducts();
  }

  async fetchProducts() {
    this.loading = true;
    try {
      const data = await this.productService.getAll();
      if (data && data.length > 0) {
        this.products = data;
        this.logger.info('Đã tải sản phẩm từ API', data);
      } else {
        this.logger.warn('API trả về rỗng, dùng dữ liệu mock');
        this.products = productsMock;
      }
    } catch (error) {
      this.logger.error('Lỗi khi tải sản phẩm, fallback sang mock', error);
      this.products = productsMock;
    } finally {
      this.loading = false;
    }
  }

  get paginatedProducts(): ProductSummaryDto[] {
    const start = (this.page - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  changePage(p: number) {
    this.page = p;
  }

  handleAddToCart(product: ProductSummaryDto) {
    this.logger.info('Click vào giỏ hàng', product);
  }

  handleAddToFavorite(product: ProductSummaryDto) {
    this.logger.info('Click vào yêu thích', product);
  }

  shouldShowPage(pageNum: number): boolean {
    const total = Math.ceil(this.products.length / this.pageSize);
    if (total <= 7) return true;
    if (pageNum === 1 || pageNum === total) return true;
    if (Math.abs(pageNum - this.page) <= 1) return true;
    return false;
  }

  shouldShowEllipsis(pageNum: number): boolean {
    const total = Math.ceil(this.products.length / this.pageSize);
    if (total <= 7) return false;
    if (pageNum === 2 && this.page > 4) return true;
    if (pageNum === total - 1 && this.page < total - 3) return true;
    return false;
  }
}
