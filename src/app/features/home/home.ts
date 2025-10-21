import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CurrencyPipe],
  templateUrl: './home.html',
})
export class HomeComponent {
  categories = [
    {
      name: 'Thời trang nam',
      description: 'Phong cách và năng động',
      imageUrl: '/assets/images/categories/men-fashion.jpg',
    },
    {
      name: 'Thời trang nữ',
      description: 'Thanh lịch và hiện đại',
      imageUrl: '/assets/images/categories/women-fashion.jpg',
    },
    {
      name: 'Giày dép',
      description: 'Thoải mái và bền bỉ',
      imageUrl: '/assets/images/categories/shoes.jpg',
    },
    {
      name: 'Phụ kiện',
      description: 'Tôn lên cá tính riêng',
      imageUrl: '/assets/images/categories/accessories.jpg',
    },
  ];

  featuredProducts = [
    {
      name: 'Áo Thun Nam Cotton',
      price: 199000,
      imageUrl: '/assets/images/products/tshirt-men.jpg',
    },
    {
      name: 'Váy Nữ Dáng Suông',
      price: 349000,
      imageUrl: '/assets/images/products/dress-women.jpg',
    },
    {
      name: 'Giày Sneaker Trắng',
      price: 499000,
      imageUrl: '/assets/images/products/sneaker.jpg',
    },
    {
      name: 'Túi Xách Da Nữ',
      price: 599000,
      imageUrl: '/assets/images/products/handbag.jpg',
    },
  ];

  addToCart(product: any) {
    console.log('Đã thêm sản phẩm vào giỏ hàng:', product.name);
  }
}