import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { selectIsLoggedIn } from '@features/auth/store/auth.selectors';
import { logout } from '@features/auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, MatIcon],
  templateUrl: './header.html',
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string>;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  constructor(private store: Store) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
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