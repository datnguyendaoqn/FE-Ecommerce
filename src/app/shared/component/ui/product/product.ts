import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSummaryDto } from '@dtos/product/product';
import { MatIconModule } from '@angular/material/icon'; // nếu dùng <mat-icon>
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './product.html',
})
export class ProductCardComponent {
  @Input() product!: ProductSummaryDto;
  @Input() compact = false;

  @Output() addToCart = new EventEmitter<ProductSummaryDto>();
  @Output() addToFavorite = new EventEmitter<ProductSummaryDto>();

  onAddToCart() {
    this.addToCart.emit(this.product);
  }

  onAddToFavorite() {
    this.addToFavorite.emit(this.product);
  }
}
