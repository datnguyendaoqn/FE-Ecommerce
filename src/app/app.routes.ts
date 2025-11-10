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
import { SellerDashboardComponent } from '@features/seller/dashboard/dashboard';
import { SellerProductListComponent } from '@features/seller/product-list/product-list';
// ========== THÊM IMPORT MỚI ==========
import { SellerProductFormComponent } from '@features/seller/product-form/product-form'; 
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
      { path: "product/:id", component: ProductDetailComponent}
    ]
  },
  
  // =================== ROUTE SELLER HOÀN CHỈNH ===================
  {
    path: 'seller',
    component: SellerLayoutComponent, 
    canActivate: [sellerGuard],      
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: SellerDashboardComponent },
      { path: 'products', component: SellerProductListComponent },
      // ========== THÊM 2 ROUTE MỚI ==========
      { path: 'product/new', component: SellerProductFormComponent }, // <-- Trang Thêm mới
      { path: 'product/:id', component: SellerProductFormComponent }  // <-- Trang Chỉnh sửa
      // =====================================
    ]
  },
  // =================== KẾT THÚC ROUTE SELLER ===================

  // Routes không dùng layout (Login, Register)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '' }
];