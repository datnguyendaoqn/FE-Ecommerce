import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { selectFullName, selectIsLoggedIn, selectUserRole } from '@features/auth/store/auth.selectors';
import { logout } from '@features/auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, MatIcon],
  templateUrl: './header.html',
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string | undefined>;
  userRole$!: Observable<string | undefined>; 
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  

  constructor(private store: Store, private router: Router) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userName$ = this.store.select(selectFullName);
    this.userRole$ = this.store.select(selectUserRole); 

  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeMenus() {
    this.isMobileMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  logout() {
    this.store.dispatch(logout());
    this.closeMenus();
    localStorage.clear();
    window.location.href = '/';
  }
  goToSellerRegistration() {
  this.closeMenus();
  this.router.navigate(['/seller/registration']);
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
}