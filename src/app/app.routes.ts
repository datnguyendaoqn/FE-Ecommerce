import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AboutComponent } from './features/about/about';
import { HomeComponent } from './features/home/home';
import { ErrorComponent } from './shared/error/error';
import { MainLayoutComponent } from './app';
import { CartComponent } from '@features/cart/cart';
import { ContactComponent } from '@features/contact/contact';
import { ProductDetailComponent } from '@features/product/product-detail/product-detail';

// =================== IMPORT HOÀN CHỈNH ===================
import { sellerGuard } from '@core/guards/seller.guard';
import { SellerLayoutComponent } from '@features/seller/seller';
import { DashboardComponent } from '@features/seller/dashboard/dashboard';
import { SellerProductListComponent } from '@features/seller/product-list/product-list';
import { SellerRegistrationComponent } from '@features/seller/register/registration';
import { OrderCustomerComponent } from '@features/order-customer/order-customer';
// ========== THÊM IMPORT MỚI ==========
import { SellerOrderListComponent } from '@features/seller/order-list/order-list';
import { SellerProductFormComponent } from '@features/seller/product-form/product-form';
import { AddressBookComponent } from '@features/adreesBook/adress-book';
// ===================================


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'error', component: ErrorComponent },
      { path: 'cart', component: CartComponent },
      { path: 'registration', component: SellerRegistrationComponent },
      { path: "product/:id", component: ProductDetailComponent },
      { path: "address-books", component: AddressBookComponent },
      { path: "order-customer", component:OrderCustomerComponent}
    ]
  },

  // =================== ROUTE SELLER HOÀN CHỈNH ===================
  {
    path: 'seller',
    component: SellerLayoutComponent,
    canActivate: [sellerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: SellerProductListComponent },
      { path: 'product/new', component: SellerProductFormComponent },
      { path: 'product/:id', component: SellerProductFormComponent },
      { path: 'orders', component: SellerOrderListComponent }
    ]
  },
  // =================== KẾT THÚC ROUTE SELLER ===================

  // Routes không dùng layout (Login, Register)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '' }
];