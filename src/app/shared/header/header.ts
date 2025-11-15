import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { selectFullName, selectIsLoggedIn, selectUserRole } from '@features/auth/store/auth.selectors';
import { logout } from '@features/auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { selectCartCount } from '@features/auth/store/cart.selector';
import { AuthService } from 'src/services/auth/auth.service';
import { loadCartFailure, loadCartSuccess } from '@features/auth/store/cart.actions';
import { HelperService } from 'src/helpers/hepler.service';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/services/product/product.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, MatIcon, FormsModule],
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string | undefined>;
  userRole$!: Observable<string | undefined>;
  count$!: Observable<number | undefined>;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;

  searchTerm = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Autocomplete
  showAutocomplete = false;
  autocompleteResults: any[] = [];
  loadingAutocomplete = false;
  selectedIndex = -1;

  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService,
    private readonly helperService: HelperService,
    private productService: ProductService // Inject ProductService
  ) {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.userName$ = this.store.select(selectFullName);
    this.userRole$ = this.store.select(selectUserRole);
    this.count$ = this.store.select(selectCartCount);
  }

  async ngOnInit(): Promise<void> {
    await this.loadAuthInfor();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.loadAutocomplete(searchTerm);
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.selectedIndex = -1;

    if (this.searchTerm.trim().length >= 2) {
      this.searchSubject.next(this.searchTerm);
      this.showAutocomplete = true;
    } else {
      this.showAutocomplete = false;
      this.autocompleteResults = [];
    }
  }

  async loadAutocomplete(searchTerm: string): Promise<void> {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      this.autocompleteResults = [];
      return;
    }
    this.showAutocomplete = true;  // ĐẶT LUÔN Ở ĐÂY


    this.loadingAutocomplete = true;
    try {
      const response = await this.productService.getPagination(1, 5, {
        searchTerm: searchTerm.trim()
      });
      this.autocompleteResults = response.data.items;
    } catch (error) {
      console.error('Error loading autocomplete:', error);
      this.autocompleteResults = [];
    } finally {
      this.loadingAutocomplete = false;
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (!this.showAutocomplete) {
      if (event.key === 'Enter') {
        this.performSearch(this.searchTerm);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.autocompleteResults.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0 && this.selectedIndex < this.autocompleteResults.length) {
          this.selectProduct(this.autocompleteResults[this.selectedIndex]);
        } else {
          this.performSearch(this.searchTerm);
        }
        break;
      case 'Escape':
        this.showAutocomplete = false;
        this.selectedIndex = -1;
        break;
    }
  }

  selectProduct(product: any): void {
    this.router.navigate(['/products', product.id]);
    this.showAutocomplete = false;
    this.searchTerm = '';
    this.closeMenus();
  }

  private performSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: searchTerm.trim() }
      });
      this.showAutocomplete = false;
      this.closeMenus();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.showAutocomplete = false;
    this.autocompleteResults = [];
    this.router.navigate(['/products']);
  }

  hideAutocomplete(): void {
    // Delay để cho phép click vào item
    setTimeout(() => {
      this.showAutocomplete = false;
      this.selectedIndex = -1;
    }, 200);
  }

  async loadAuthInfor() {
    try {
      const dataUser = this.helperService.getInforUser();
      if (dataUser) {
        const res = await this.authService.getInforMe();
        this.store.dispatch(loadCartSuccess({ cartItemCount: res.data.cartItemCount }));
      }
    } catch {
      this.store.dispatch(loadCartFailure());
    }
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