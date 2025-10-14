import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AboutComponent } from './features/about/about';
import { HomeComponent } from './features/home/home'; // 
import { ErrorComponent } from './shared/error/error';
import { MainLayoutComponent } from './app';
import { CartComponent } from '@features/cart/cart';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Layout chứa header, sidebar, footer
    children: [
      { path: '', component: HomeComponent }, //  Trang chủ
      { path: 'about', component: AboutComponent },
      { path: 'error', component: ErrorComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'cart', component: CartComponent },
      // Các route khác...
    ]
  },

  // Routes không dùng layout
  { path: '**', redirectTo: '' }
];