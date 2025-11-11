import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartProductVariantDto } from '@dtos/product-variant/product-variant';
import { CartResponseDto } from '@dtos/cart/cart.response.dto';
import { CartService } from 'src/services/cart/cart.service';
import { MOCK_CART_RESPONSE } from 'src/data/cart.data';
import { ToastrService } from 'ngx-toastr';

// DỮ LIỆU MOCK THEO ĐÚNG API RESPONSE


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, CurrencyPipe],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {

  constructor(
    private readonly cartService: CartService,
    private readonly toast: ToastrService
  ) {

  }
  cartItems = signal<CartProductVariantDto[]>([]);
  totalItemsCount = signal(0);

  subtotal = signal(0);
  total = signal(0);

  async ngOnInit() {
    // Trong thực tế: this.cartService.getCart().subscribe(response => { ... });
    await this.fetchDataCart()
  }

  async fetchDataCart() {
    try {
      const dataCart = await this.cartService.getCart()
      if (dataCart.data.items) {
        this.loadCart(dataCart);

      } else {
        this.loadCart(MOCK_CART_RESPONSE);
      }

    } catch (error) {
      this.loadCart(MOCK_CART_RESPONSE);

    }


  }

  loadCart(response: CartResponseDto) {
    this.cartItems.set(response.data.items);
    this.totalItemsCount.set(response.data.totalItemsCount);
    this.calculateTotals();
  }

  calculateTotals() {
    const sub = this.cartItems().reduce(
      (acc, item) => acc + item.priceAtTimeOfAdd * item.quantity,
      0
    );
    this.subtotal.set(sub);

    if (sub > 0) {
      this.total.set(sub);
    } else {
      this.total.set(0);
    }
  }

  updateQuantity(item: CartProductVariantDto, change: number) {
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) return;

    this.cartItems.update(items =>
      items.map(i => {
        if (i.productVariantId === item.productVariantId) {
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
    this.calculateTotals();

    // Trong thực tế gọi API:
    // this.cartService.updateCart({
    //   productVariantId: item.productVariantId,
    //   quantity: newQuantity
    // }).subscribe();
  }

  async removeItem(productVariantId: number) {
    try {
      this.cartItems.update(items => items.filter(i => i.productVariantId !== productVariantId));
      this.calculateTotals();

      await this.cartService.deleteCartItem(productVariantId);

      await this.fetchDataCart();

      this.toast.success("Xoá thành công!", "Thành công");
    } catch (error) {
      this.toast.error(String(error), "Lỗi");
    }
  }

  async removeAll() {
    try {
      this.cartItems.set([]);
      this.calculateTotals();

      await this.cartService.deleteAll();

      await this.fetchDataCart();

      this.toast.success("Xoá thành công!", "Thành công");
    } catch (error) {
      this.toast.error(String(error), "Lỗi");
    }
  }

}