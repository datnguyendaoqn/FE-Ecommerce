// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { MatIcon } from '@angular/material/icon';

// import { Observable, from } from 'rxjs';
// import { ProductService } from 'src/services/product/product.service';
// import { ProductSummaryDto } from '@dtos/product/product';
// import { ProductVariantDetailDto } from '@dtos/product/product-detail';

// @Component({
//     selector: 'app-product-list',
//     standalone: true,
//     imports: [CommonModule, RouterModule, MatIcon, CurrencyPipe],
//     templateUrl: './product-list.html',
// })
// export class ProductListComponent implements OnInit {
//     private productService = inject(ProductService);

//     products$!: Observable<ProductSummaryDto[]>;

//     ngOnInit() {
//         this.products$ = from(this.productService.getAll());
//     }

//     getPrimaryImageUrl(media: MediaDto[]): string {
//         if (!media || media.length === 0) {

//             return 'https://via.placeholder.com/150.png?text=No+Image';
//         }

//         const primaryImage = media.find((m) => m.isPrimary);

//         return primaryImage ? primaryImage.imageUrl : media[0].imageUrl;
//     }

//     getTotalStock(variants: ProductVariantDetailDto[]): number {
//         if (!variants || variants.length === 0) {
//             return 0;
//         }
//         return variants.reduce((acc, v) => acc + v.quantity, 0);
//     }

//     deleteProduct(id: number) {
//         if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
//             console.log('Xóa sản phẩm:', id);
//         }
//     }
// }