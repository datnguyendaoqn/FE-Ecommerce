import { Component, OnInit, signal } from '@angular/core';
import { CartItemDto } from '@dtos/cart/cart.dto';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

// DỮ LIỆU MOCK CHO GIỎ HÀNG
const MOCK_CART_ITEMS: CartItemDto[] = [
  {
    id: 1,
    variantId: 10,
    quantity: 2,
    productName: 'Áo Sơ Mi Nam Trắng Vải Lụa',
    variantSize: 'M',
    color: 'Trắng',
    price: 450000,
    stock: 50,
    imageUrl: 'https://via.placeholder.com/600x600.png?text=Ao+So+Mi+1',
  },
  {
    id: 2,
    variantId: 15,
    quantity: 1,
    productName: 'Áo Thun Polo Nữ',
    variantSize: 'S',
    color: 'Đen',
    price: 399000,
    stock: 120,
    imageUrl: 'https://via.placeholder.com/600x600.png?text=Ao+Thun+Polo',
  },
];

@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [CommonModule, RouterModule, MatIcon, CurrencyPipe],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {
  cartItems = signal<CartItemDto[]>([]);
  

  subtotal = signal(0);
  shippingFee = signal(30000); 
  total = signal(0);

  ngOnInit() {

    this.cartItems.set(MOCK_CART_ITEMS);
    this.calculateTotals();
  }

  calculateTotals() {
    const sub = this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
    this.subtotal.set(sub);
    
    if (sub > 0) {
      this.total.set(sub + this.shippingFee());
    } else {
      this.total.set(0);
    }
  }

  updateQuantity(item: CartItemDto, change: number) {
    this.cartItems.update(items =>
      items.map(i => {
        if (i.id === item.id) {
          const newQuantity = i.quantity + change;

          if (newQuantity <= 0) return { ...i, quantity: 0 }; 
          if (newQuantity > i.stock) return { ...i, quantity: i.stock };
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
    this.calculateTotals();
  }

  removeItem(itemId: number) {
    this.cartItems.update(items => items.filter(i => i.id !== itemId));
    this.calculateTotals();
  }
}