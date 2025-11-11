import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductSummaryDto } from '@dtos/product/product';
import { ProductDetailDto, ProductVariantDetailDto } from '@dtos/product/product-detail';
import { ProductCardComponent } from '@shared/component/ui/product/product';
import { MatIcon } from '@angular/material/icon';
import { ReviewResponseDto } from '@dtos/review/review';
import { reviewMocks } from 'src/data/review.data';
import { ProductService } from 'src/services/product/product.service';
import { productDetailMocks, productsMock } from 'src/data/product.data';
import { CartRequestDto } from '@dtos/cart/cart.request.dto';
import { CartService } from 'src/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private readonly route: ActivatedRoute, // 👈 Thêm ActivatedRoute
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private toast: ToastrService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    try {
      const productId = Number(this.route.snapshot.paramMap.get('id'));

      if (!productId || isNaN(productId)) {
        this.loadMockData();
        return;
      }

      // Gọi API lấy chi tiết sản phẩm
      const response = await this.productService.getById<ProductDetailDto>(productId);

      if (response && response.id) {
        this.product = response;
      } else {
        throw new Error('Response không có data hợp lệ');
      }
    } catch (error) {
      this.loadMockData();
    }

    if (!this.product) {
      this.loadMockData();
    }

    this.initializeProductData();
  }


  private loadMockData(): void {
    console.log('Loading mock data...');
    this.product = productDetailMocks.data;
  }

  private async initializeProductData(): Promise<void> {
    // Kiểm tra product có tồn tại và có variants
    if (!this.product || !this.product.variants || this.product.variants.length === 0) {
      this.isLoading = false;
      return;
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

  get primaryImageUrl(): string {
    if (!this.product) return 'https://placehold.co/600x600/EEE/000?text=No+Image';

    return (
      this.selectedVariant?.primaryImage?.imageUrl ||
      this.product?.productImages?.find(img => img.isPrimary)?.imageUrl ||
      'https://placehold.co/600x600/EEE/000?text=No+Image'
    );
  }

  get galleryImageUrls(): string[] {
    if (!this.product || !this.product.productImages) return [];
    return this.product.productImages.map(img => img.imageUrl);
  }

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

  async addToCart(): Promise<void> {
    if (!this.selectedVariant?.isInStock) {
      this.toast.warning('Sản phẩm này hiện đã hết hàng', 'Cảnh báo');
      return;
    }

    const item: CartRequestDto = {
      productVariantId: this.selectedVariant.id,
      quantity: 1
    }

    try {
      await this.cartService.createCartItem(item);
      this.toast.success("Đã thêm vào giỏ hàng", "Thành công");
    } catch (error) {
      this.toast.error(String(error), "Lỗi");
    }
  }

  onAddToFavorite(p: ProductSummaryDto | ProductDetailDto): void {
    this.toast.info(`Đã thêm "${p.name}" vào danh sách yêu thích!`, 'Yêu thích');
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}