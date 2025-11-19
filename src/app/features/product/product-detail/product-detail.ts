import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductSummaryDto } from '@dtos/product/product';
import { ProductDetailDto, ProductVariantDetailDto } from '@dtos/product/product-detail';
import { ProductCardComponent } from '@shared/component/ui/product/product';
import { MatIcon } from '@angular/material/icon';
import { ReviewResponseDto } from '@dtos/review/review';
import { ProductService } from 'src/services/product/product.service';
import { productDetailMocks, productsMock } from 'src/data/product.data';
import { CartRequestDto } from '@dtos/cart/cart.request.dto';
import { CartService } from 'src/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { addCart } from '@features/auth/store/cart.actions';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from 'src/helpers/hepler.service';
import { LoginDialogComponent } from '@shared/component/ui/auth/login-dialog';

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
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private toast: ToastrService,
    private store: Store,
    private dialog: MatDialog,
    private helperService: HelperService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const productId = Number(params.get('id'));
      this.isLoading = true;

      try {
        if (!productId || isNaN(productId)) {
          this.loadMockData();
        } else {
          const response = await this.productService.getById<ProductDetailDto>(productId);

          try {
            this.relatedProducts = await this.productService.getRelatedProduct(productId);
          } catch {
            this.relatedProducts = [];
          }

          this.product = response && response.id ? response : productDetailMocks.data;
        }
      } catch {
        this.loadMockData();
      }

      this.initializeProductData();
    });
  }

  private loadMockData(): void {
    console.log('Loading mock data...');
    this.product = productDetailMocks.data;
  }

  private async initializeProductData(): Promise<void> {
    if (!this.product || !this.product.variants || this.product.variants.length === 0) {
      this.isLoading = false;
      return;
    }

    // Chọn biến thể đầu tiên có sẵn hàng
    this.selectedVariant = this.product.variants.find(v => v.isInStock) || this.product.variants[0];

    // Fallback cho related products
    if (!this.relatedProducts || this.relatedProducts.length === 0) {
      this.relatedProducts = productsMock;
    }

    // Lấy reviews
    try {
      const apiReviews = await this.productService.getReviewProduct(this.product.id);
      this.reviews = apiReviews?.data ?? [];
    } catch {
      this.reviews = [];
    }

    // Tính rating
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
    if (!this.product) return [];

    const imageSet = new Set<string>();

    // Thêm ảnh từ variants
    if (this.product.variants && this.product.variants.length > 0) {
      this.product.variants.forEach(variant => {
        if (variant.primaryImage?.imageUrl) {
          imageSet.add(variant.primaryImage.imageUrl);
        }
      });
    }

    return Array.from(imageSet);
  }

  get originalPrice(): number {
    return this.selectedVariant?.price ? Math.round(this.selectedVariant.price * 1.25) : 0;
  }

  // ==== HANDLERS ====

  onSelectVariant(v: ProductVariantDetailDto): void {
    this.selectedVariant = v;
  }

  onSelectVariantByImage(index: number): void {
    // Chọn variant dựa trên index của gallery image
    if (this.product.variants && this.product.variants[index]) {
      this.selectedVariant = this.product.variants[index];
    }
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  async addToCart(): Promise<void> {
    const user = this.helperService.getInforUser();

    if (!user) {
      this.dialog.open(LoginDialogComponent, {
        width: '450px',
        maxWidth: '90vw',
        panelClass: 'login-dialog',
        disableClose: false,
        autoFocus: true
      });
      return;
    }

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
      this.router.navigate(['/cart']);
      this.toast.success("Đã thêm vào giỏ hàng", "Thành công");
      this.store.dispatch(addCart());
    } catch (error) {
      this.toast.error(String(error), "Lỗi");
    }
  }

  onAddToFavorite(p: ProductSummaryDto | ProductDetailDto): void {
    const user = this.helperService.getInforUser();

    if (!user) {
      this.dialog.open(LoginDialogComponent, {
        width: '450px',
        maxWidth: '90vw',
        panelClass: 'login-dialog',
        disableClose: false
      });
      return;
    }

    this.toast.info(`Đã thêm "${p.name}" vào danh sách yêu thích!`, 'Yêu thích');
  }
}