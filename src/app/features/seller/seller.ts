import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { logout } from '@features/auth/store/auth.actions';
import { selectFullName } from '@features/auth/store/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon],
  templateUrl: './seller.html',
})
export class SellerLayoutComponent {
  isSidebarMinimized = false;
  userName$!: Observable<string | undefined>;

  constructor(private store: Store) {
    this.userName$ = this.store.select(selectFullName);
  }

  toggleSidebar() {
    this.isSidebarMinimized = !this.isSidebarMinimized;
  }
  
  onLogout() {
    this.store.dispatch(logout());
    localStorage.clear();
    window.location.href = '/';
  }
}