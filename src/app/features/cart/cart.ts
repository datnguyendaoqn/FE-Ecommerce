import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CartProductVariantDto } from '@dtos/product-variant/product-variant';
import { CartResponseDto } from '@dtos/cart/cart.response.dto';
import { CartService } from 'src/services/cart/cart.service';
import { MOCK_CART_RESPONSE } from 'src/data/cart.data';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';
import { CartShopDto } from '@dtos/cart/cart.dto';
import { AddressBooksSerivce } from 'src/services/address-books/address-books.service';
import { Store } from '@ngrx/store';
import { addCart, previousCart, resetCart } from '@features/auth/store/cart.actions';
import { AddressSelectDialogComponent } from '@shared/component/ui/address-books/dialog';
import { OrderService } from 'src/services/order/order.service';

// Extend để thêm trạng thái selected
interface CartShopWithSelection extends CartShopDto {
  selected: boolean;
  items: (CartProductVariantDto & { selected: boolean })[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatCheckboxModule, CurrencyPipe],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {

  constructor(
    private readonly cartService: CartService,
    private readonly toast: ToastrService,
    private readonly logger: NGXLogger,
    private readonly addressBookService: AddressBooksSerivce,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly store: Store,
    private readonly orderService: OrderService
  ) { }

  // Dữ liệu cart với trạng thái selection
  shops = signal<CartShopWithSelection[]>([]);

  // Tổng số items và tổng giá từ API
  totalItemsCount = signal(0);
  grandTotalPrice = signal(0);

  // Địa chỉ mặc định
  defaultAddress = signal<any>(null);
  isLoadingAddress = signal(false);

  // Computed: Tổng giá của các items được chọn
  selectedTotalPrice = computed(() => {
    return this.shops().reduce((total, shop) => {
      if (shop.selected) {
        return total + shop.items
          .filter(item => item.selected)
          .reduce((sum, item) => sum + (item.priceAtTimeOfAdd * item.quantity), 0);
      }
      return total;
    }, 0);
  });

  // Computed: Số lượng items được chọn
  selectedItemsCount = computed(() => {
    return this.shops().reduce((count, shop) => {
      return count + shop.items.filter(item => item.selected).length;
    }, 0);
  });

  // Computed: Số shop được chọn
  selectedShopsCount = computed(() => {
    return this.shops().filter(shop => shop.selected && shop.items.some(item => item.selected)).length;
  });

  // Computed: Có item nào được chọn không
  hasSelectedItems = computed(() => {
    return this.selectedItemsCount() > 0;
  });

  async ngOnInit() {
    await this.fetchDataCart();
    await this.fetchDefaultAddress();
  }

  async fetchDataCart() {
    try {
      const dataCart = await this.cartService.getCart();
      if (dataCart.data.shops && dataCart.data.shops.length > 0) {
        this.loadCart(dataCart);
      } else {
        this.loadCart(MOCK_CART_RESPONSE);
      }
    } catch (error) {
      this.logger.error('Error fetching cart:', error);
      this.loadCart(MOCK_CART_RESPONSE);
    }
  }

  async fetchDefaultAddress() {
    try {
      this.isLoadingAddress.set(true);
      const response = await this.addressBookService.getAll();

      // Tìm địa chỉ mặc định từ danh sách
      const defaultAddress = response.find((addr: any) => addr.isDefault);
      this.defaultAddress.set(defaultAddress || null);

      this.logger.info('Default address:', defaultAddress);
    } catch (error) {
      this.logger.error('Error fetching default address:', error);
      this.defaultAddress.set(null);
    } finally {
      this.isLoadingAddress.set(false);
    }
  }

  loadCart(response: CartResponseDto) {
    // Thêm trạng thái selected cho shops và items
    const shopsWithSelection: CartShopWithSelection[] = response.data.shops.map(shop => ({
      ...shop,
      selected: true, // Mặc định chọn tất cả
      items: shop.items.map(item => ({
        ...item,
        selected: true // Mặc định chọn tất cả
      }))
    }));

    this.shops.set(shopsWithSelection);
    this.totalItemsCount.set(response.data.grandTotalItemsCount);
    this.grandTotalPrice.set(response.data.grandTotalPrice);
  }

  // Toggle chọn toàn bộ shop
  toggleShop(shopId: number) {
    this.shops.update(shops =>
      shops.map(shop => {
        if (shop.shopId === shopId) {
          const newSelected = !shop.selected;
          return {
            ...shop,
            selected: newSelected,
            items: shop.items.map(item => ({ ...item, selected: newSelected }))
          };
        }
        return shop;
      })
    );
  }

  // Toggle chọn từng item
  toggleItem(shopId: number, productVariantId: number) {
    this.shops.update(shops =>
      shops.map(shop => {
        if (shop.shopId === shopId) {
          const updatedItems = shop.items.map(item =>
            item.productVariantId === productVariantId
              ? { ...item, selected: !item.selected }
              : item
          );

          // Tự động update trạng thái shop dựa vào items
          const allSelected = updatedItems.every(item => item.selected);
          const someSelected = updatedItems.some(item => item.selected);

          return {
            ...shop,
            items: updatedItems,
            selected: allSelected || someSelected
          };
        }
        return shop;
      })
    );
  }

  // Kiểm tra shop có được chọn một phần không (indeterminate)
  isShopIndeterminate(shop: CartShopWithSelection): boolean {
    const selectedCount = shop.items.filter(item => item.selected).length;
    return selectedCount > 0 && selectedCount < shop.items.length;
  }

  async updateQuantity(item: CartProductVariantDto, change: number) {
    const newQuantity = item.quantity + change;
    this.logger.info(`New quantity: ${newQuantity}`);

    if (newQuantity <= 0) return;

    try {
      await this.cartService.updateQuantityCartItem({
        productVariantId: item.productVariantId,
        NewQuantity: newQuantity
      });

      await this.fetchDataCart();
      this.toast.success('Cập nhật số lượng thành công!', 'Thành công');
      this.store.dispatch(addCart());
    } catch (error) {
      this.logger.error('Error updating quantity:', error);
      this.toast.error('Không thể cập nhật số lượng', 'Lỗi');
    }
  }

  async removeItem(productVariantId: number) {
    try {
      await this.cartService.deleteCartItem(productVariantId);
      await this.fetchDataCart();
      this.toast.success('Xóa sản phẩm thành công!', 'Thành công');
      this.store.dispatch(previousCart());
    } catch (error) {
      this.logger.error('Error removing item:', error);
      this.toast.error(String(error), 'Lỗi');
    }
  }

  async removeAll() {
    try {
      await this.cartService.deleteAll();
      await this.fetchDataCart();
      this.store.dispatch(resetCart());
      this.toast.success('Xóa tất cả thành công!', 'Thành công');
    } catch (error) {
      this.logger.error('Error removing all items:', error);
      this.toast.error(String(error), 'Lỗi');
    }
  }

  // Lấy danh sách productVariantIds đã chọn
  getSelectedVariantIds(): number[] {
    const variantIds: number[] = [];
    this.shops().forEach(shop => {
      if (shop.selected) {
        shop.items.forEach(item => {
          if (item.selected) {
            variantIds.push(item.productVariantId);
          }
        });
      }
    });
    return variantIds;
  }

  // Tạo shopNotes từ các shop đã chọn
  getShopNotes() {
    return this.shops()
      .filter(shop => shop.selected && shop.items.some(item => item.selected))
      .map(shop => ({
        shopId: shop.shopId,
        note: '' // Có thể thêm UI để user nhập note sau
      }));
  }

  // Proceed to checkout
  async proceedToCheckout() {
    if (!this.hasSelectedItems()) {
      this.toast.warning('Vui lòng chọn ít nhất một sản phẩm!', 'Thông báo');
      return;
    }

    // Kiểm tra địa chỉ mặc định
    if (!this.defaultAddress()) {
      // Mở dialog chọn địa chỉ
      this.openAddressSelectDialog();
      return;
    }

    // Tạo payload theo đúng format API
    const orderPayload = {
      addressBookId: this.defaultAddress().id,
      paymentMethod: 'COD', // Có thể thêm UI để chọn phương thức thanh toán
      shopNotes: this.getShopNotes(),
      tickedVariantIds: this.getSelectedVariantIds()
    };

    try {
      this.logger.info('Creating order with payload:', orderPayload);
      const res = await this.orderService.create(orderPayload);
      
      this.toast.success('Đặt hàng thành công!', 'Thành công');
      this.store.dispatch(resetCart());
      
      // Navigate to order success page hoặc order detail
      // this.router.navigate(['/orders', res.orderId]);
      
    } catch (error) {
      this.logger.error('Error creating order:', error);
      this.toast.error('Không thể tạo đơn hàng. Vui lòng thử lại!', 'Lỗi');
    }
  }

  // Mở dialog chọn địa chỉ
  openAddressSelectDialog() {
    const dialogRef = this.dialog.open(AddressSelectDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      id: 'address-select',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(selectedAddress => {
      if (selectedAddress) {
        this.defaultAddress.set(selectedAddress);
        this.toast.success('Đã chọn địa chỉ giao hàng!', 'Thành công');

        // Tiếp tục checkout
        this.proceedToCheckout();
      }
    });
  }

  // Điều hướng đến trang address-books
  navigateToAddressBooks() {
    this.router.navigate(['/address-books']);
  }

  // Thay đổi địa chỉ
  changeAddress() {
    this.openAddressSelectDialog();
  }
}