import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSummaryDto } from '@dtos/product/product';
import { MatIconModule } from '@angular/material/icon';
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

  @Output() addToFavorite = new EventEmitter<ProductSummaryDto>();


  onAddToFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addToFavorite.emit(this.product);
  }
}