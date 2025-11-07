import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductSummaryDto } from '@dtos/product/product';
import { ProductDetailResponseDto, ProductVariantDetailDto } from '@dtos/product/product-detail';
import { ProductCardComponent } from '@shared/component/ui/product/product';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, MatIcon],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent implements OnInit {
  product!: ProductDetailResponseDto;
  selectedVariant!: ProductVariantDetailDto;
  relatedProducts: ProductSummaryDto[] = [];

  isLoading = true;
  isDescriptionExpanded = false;
  averageRating = 0;
  reviewCount = 0;
  activeTab: string = 'description'; // Tab mặc định
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Giả lập đang tải
    setTimeout(() => {
      this.product = {
        id: 1,
        name: 'Áo Thun Nam Cotton Mềm',
        description:
          'Thoáng mát, co giãn tốt, phù hợp mặc hàng ngày. Áo thun được làm từ chất liệu cotton 100% với khả năng thấm hút mồ hôi tuyệt vời, mang lại cảm giác dễ chịu và tự tin trong mọi hoạt động. Sản phẩm được thiết kế hiện đại, dễ phối đồ, phù hợp cho nhiều hoàn cảnh khác nhau.',
        brand: 'Coolmate',
        primaryImageUrl:
          'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409940/bxqy4mvsgy7ws4uc5orn.jpg',
        galleryImageUrls: [
          'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409940/bxqy4mvsgy7ws4uc5orn.jpg',
          'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409908/tbehhqpenv9mzrlioerq.jpg',
        ],
        variants: [
          {
            id: 1,
            productId: 1,
            sku: 'SKU001',
            color: 'Đen',
            variantSize: 'M',
            material: 'Cotton',
            price: 199000,
            quantity: 10,
            primaryImageUrl:
              'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409940/bxqy4mvsgy7ws4uc5orn.jpg',
          },
          {
            id: 2,
            productId: 1,
            sku: 'SKU002',
            color: 'Xanh',
            variantSize: 'M',
            material: 'Cotton',
            price: 99000,
            quantity: 2,
            primaryImageUrl:
              'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409940/bxqy4mvsgy7ws4uc5orn.jpg',
          },
        ],
        reviews: [
          {
            id: 1,
            authorName: 'Nguyễn V** A',
            rating: 4.5,
            comment: 'Áo đẹp, chất vải mềm mịn. Giao hàng nhanh.',
            createdAt: '2025-11-05T12:00:00Z',
            variantInfo: 'Màu: Đen, Size: M',
          },
          {
            id: 2,
            authorName: 'Trần T** B',
            rating: 5,
            comment: 'Rất ưng ý, mặc vừa vặn và thoáng mát.',
            createdAt: '2025-11-03T08:30:00Z',
            variantInfo: 'Màu: Trắng, Size: L',
          },
        ],
      };

      this.selectedVariant = this.product.variants[0];
      this.relatedProducts = [
        {
          id: 2,
          name: 'Áo Polo Nam Trơn',
          startingPrice: 259000,
          primaryImageUrl:
            'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409940/bxqy4mvsgy7ws4uc5orn.jpg',
          status: 'active',
        },
        {
          id: 3,
          name: 'Áo Hoodie Form Rộng',
          startingPrice: 349000,
          primaryImageUrl:
            'https://res.cloudinary.com/ddqg9afsy/image/upload/v1762409908/tbehhqpenv9mzrlioerq.jpg',
          status: 'active',
        },
      ];

      // Tính toán đánh giá trung bình
      const reviews = this.product.reviews ?? [];
      this.reviewCount = reviews.length;

      if (this.reviewCount > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        this.averageRating = Number((totalRating / this.reviewCount).toFixed(1));
      } else {
        this.averageRating = 0;
      }


      this.isLoading = false;
    }, 800);
  }

  onSelectVariant(v: ProductVariantDetailDto): void {
    this.selectedVariant = v;
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  addToCart(): void {
    alert(`Đã thêm ${this.product.name} - ${this.selectedVariant.color} vào giỏ hàng`);
  }

  onAddToFavorite(p: ProductSummaryDto): void {
    alert(`Đã thêm "${p.name}" vào danh sách yêu thích!`);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

}
