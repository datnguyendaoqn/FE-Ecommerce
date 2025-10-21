import { Component } from '@angular/core';
import { CommonModule,CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule,RouterModule,CurrencyPipe],
  templateUrl: './home.html',
})
export class HomeComponent {
  // 🔹 Mock dữ liệu hero section
  hero = {
    title: 'Khám phá bộ sưu tập Thu Đông 2025',
    subtitle: 'Phong cách hiện đại, chất lượng đỉnh cao',
    image: 'assets/hero-banner.jpg',
    ctaText: 'Mua ngay',
    ctaLink: '/shop'
  };

  // 🔹 Mock danh mục sản phẩm
  categories = [
    { name: 'Áo Nam', image: 'assets/categories/shirt-men.jpg' },
    { name: 'Quần Nam', image: 'assets/categories/pants-men.jpg' },
    { name: 'Áo Khoác', image: 'assets/categories/jacket-men.jpg' },
    { name: 'Phụ kiện', image: 'assets/categories/accessories.jpg' },
  ];

  // 🔹 Mock sản phẩm nổi bật
  featuredProducts = [
    { name: 'Áo Thun Basic', price: 299000, image: 'assets/products/shirt1.jpg' },
    { name: 'Quần Jean Slim Fit', price: 499000, image: 'assets/products/jean1.jpg' },
    { name: 'Áo Khoác Bomber', price: 799000, image: 'assets/products/jacket1.jpg' },
    { name: 'Giày Sneaker Trắng', price: 899000, image: 'assets/products/shoes1.jpg' },
  ];
}