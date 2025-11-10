import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductSummaryDto } from '@dtos/product/product';
import { ProductDetailDto, ProductVariantDetailDto } from '@dtos/product/product-detail';
import { ProductCardComponent } from '@shared/component/ui/product/product';
import { MatIcon } from '@angular/material/icon';
import { ReviewResponseDto } from '@dtos/review/review';
import { reviewMocks } from 'src/data/review.data';
import { ProductService } from 'src/services/product/product.service';
import { productDetailMocks, productsMock } from 'src/data/product.data';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, MatIcon],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent implements OnInit {
  product!: ProductDetailDto;
  reviews: ReviewResponseDto[] = [];
  selectedVariant!: ProductVariantDetailDto;
  relatedProducts: ProductSummaryDto[] = [];

  isLoading = true;
  isDescriptionExpanded = false;
  averageRating = 0;
  reviewCount = 0;
  activeTab: string = 'description';

  constructor(private readonly productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    try {
      // Gọi API lấy chi tiết sản phẩm (ví dụ id = 101)
      const response = await this.productService.getById<ProductDetailDto>(101);
      this.product = response;
    } catch (error) {
      console.error('Lỗi khi gọi API, fallback sang mock:', error);
      this.product = productDetailMocks.data;
    }

    // Chọn biến thể đầu tiên (có thể filter chỉ lấy variant còn hàng)
    this.selectedVariant = this.product.variants.find(v => v.isInStock) || this.product.variants[0];

    // Sản phẩm liên quan (mock)
    this.relatedProducts = productsMock;

    // Lấy review
    try {
      const apiReviews = await this.productService.getReviewProduct(this.product.id);
      this.reviews =
        apiReviews && Array.isArray(apiReviews) && apiReviews.length > 0
          ? apiReviews
          : reviewMocks;
    } catch (error) {
      console.error('⚠️ Lỗi lấy review, fallback sang mock:', error);
      this.reviews = reviewMocks;
    }

    // Tính rating trung bình
    this.reviewCount = this.reviews.length;
    this.averageRating =
      this.reviewCount > 0
        ? Number(
            (
              this.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
              this.reviewCount
            ).toFixed(1)
          )
        : 0;

    this.isLoading = false;
  }

  // ==== COMPUTED PROPERTIES ====
  
  /**
   * Lấy ảnh chính từ variant hoặc fallback sang product
   */
  get primaryImageUrl(): string {
    return (
      this.selectedVariant?.primaryImage?.imageUrl ||
      this.product?.productImages?.find(img => img.isPrimary)?.imageUrl ||
      'https://placehold.co/600x600/EEE/000?text=No+Image'
    );
  }

  /**
   * Lấy danh sách ảnh gallery từ product
   */
  get galleryImageUrls(): string[] {
    return this.product?.productImages?.map(img => img.imageUrl) || [];
  }

  /**
   * Tính giá gốc (giả sử giá hiện tại đã giảm 20%)
   */
  get originalPrice(): number {
    return this.selectedVariant?.price ? this.selectedVariant.price * 1.25 : 0;
  }

  // ==== HANDLERS ====

  onSelectVariant(v: ProductVariantDetailDto): void {
    this.selectedVariant = v;
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  addToCart(): void {
    if (!this.selectedVariant?.isInStock) {
      alert('Sản phẩm này hiện đã hết hàng');
      return;
    }
    alert(`Đã thêm ${this.product.name} - ${this.selectedVariant.color} (Size ${this.selectedVariant.variantSize}) vào giỏ hàng`);
  }

  onAddToFavorite(p: ProductSummaryDto | ProductDetailDto): void {
    alert(`Đã thêm "${p.name}" vào danh sách yêu thích!`);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}