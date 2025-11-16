import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { LoggerService } from 'src/configs/logger.service';
import { ProductCardComponent } from '@shared/component/ui/product/product';
import { ProductSummaryDto } from '@dtos/product/product';
import { ProductService } from 'src/services/product/product.service';
import { productsMock } from 'src/data/product.data';
import { CategoryService } from 'src/services/category/category.service';
import { NgxCurrencyDirective, NgxCurrencyInputMode } from "ngx-currency";
import { RecursiveCategoryDto } from "@dtos/category/category.dto";


interface FlatCategory extends RecursiveCategoryDto {
  level: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CarouselModule, MatIcon, MatSliderModule, ProductCardComponent, NgxCurrencyDirective],
  templateUrl: './home.html',
})

export class HomeComponent implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) { }

  Math = Math;

  slides = [
    'assets/images/banner-1.jpg',
    'assets/images/banner-2.jpg',
    'assets/images/banner-3.jpg'
  ];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    dots: false,
    autoplayTimeout: 3000,
    items: 1,
  };

  products: ProductSummaryDto[] = [];
  top5Products: ProductSummaryDto[] = [];
  categories: FlatCategory[] = [];
  loading = false;
  loadingTop5 = false;
  loadingCategories = false;
  page = 1;
  pageSize = 8;
  totalItems = 0;
  errorMessage: string | null = null;
  
  configCurrency = {
    align: "left",
    allowNegative: false,
    allowZero: true,
    precision: 0,
    prefix: "",
    suffix: " VNĐ",
    thousands: ".",
    nullable: true,
    min: 0,
    max: 10000000,
    inputMode: NgxCurrencyInputMode.Financial
  }

  // Price range for slider
  priceRange = {
    min: 0,
    max: 100000000,
    step: 100000
  };

  // Filter state
  showFilterPanel = false;
  filters = {
    categoryId: null as number | null,
    minPrice: 0,
    maxPrice: 100000000,
    minRating: null as number | null,
    sortBy: ''
  };

  sortOptions = [
    { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
    { value: 'price_desc', label: 'Giá: Cao đến Thấp' },
    { value: 'name_asc', label: 'Tên: A-Z' },
    { value: 'name_desc', label: 'Tên: Z-A' },
    { value: 'rating_desc', label: 'Đánh giá: Cao nhất' }
  ];

  async ngOnInit() {
    this.logger.info('HomeComponent initialized');
    
    // Load data in parallel
    await Promise.all([
      this.fetchCategories(),
      this.fetchProducts(),
      this.fetchTop5Products()
    ]);
    
    this.logger.info('All data loaded', {
      productsCount: this.products.length,
      top5Count: this.top5Products.length,
      categoriesCount: this.categories.length
    });
  }

  get paginatedProducts(): ProductSummaryDto[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginated = this.products.slice(start, end);
    
    this.logger.debug('Paginated products', {
      page: this.page,
      pageSize: this.pageSize,
      start,
      end,
      totalProducts: this.products.length,
      paginatedCount: paginated.length
    });
    
    return paginated;
  }

  async fetchCategories() {
    this.loadingCategories = true;
    try {
      this.logger.info('Fetching categories...');
      const res = await this.categoryService.getAllCategories();

      this.categories = this.flattenCategories(res);

      this.logger.info('Categories loaded successfully', {
        count: this.categories.length,
        categories: this.categories
      });
    } catch (error) {
      this.logger.error('Error loading categories', error);
      this.categories = [];
    } finally {
      this.loadingCategories = false;
    }
  }

  flattenCategories(categories: RecursiveCategoryDto[], level: number = 0): FlatCategory[] {
    let result: FlatCategory[] = [];
    categories.forEach((cat) => {
      result.push({
        ...cat,
        children: [],
        level: level
      });

      if (cat.children && cat.children.length > 0) {
        result.push(...this.flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  }

  getCategoryPrefix(level: number): string {
    return '— '.repeat(level);
  }

  async fetchProducts() {
    this.loading = true;
    this.errorMessage = null;
    
    try {
      const filterParams = this.buildFilterParams();
      
      this.logger.info('Fetching products with filters', {
        page: this.page,
        pageSize: this.pageSize,
        filters: filterParams
      });
      
      const data = await this.productService.getPagination(
        this.page,
        this.pageSize,
        filterParams
      );

      this.logger.info('Products API response', data);

      // Check if response has the expected structure
      if (data && data.data && data.data.items) {
        this.products = data.data.items;
        this.totalItems = data.totalCount || 0;
        
        this.logger.info('Products loaded successfully', {
          count: this.products.length,
          totalItems: this.totalItems,
          products: this.products
        });
      } else {
        // Response structure might be different
        this.logger.warn('Unexpected API response structure', data);
        
        // Try alternative structure
        if (data && Array.isArray(data)) {
          this.products = data;
          this.totalItems = data.length;
        } else if (data && data.data.items) {
          this.products = data.data.items;
          this.totalItems = data.totalCount || data.data.items.length;
        } else {
          throw new Error('Invalid API response structure');
        }
      }

    } catch (error) {
      this.logger.error('Error loading products, using mock data', error);
      this.errorMessage = 'Không thể tải sản phẩm từ server. Đang hiển thị dữ liệu mẫu.';
      
      // Use mock data as fallback
      this.products = productsMock;
      this.totalItems = productsMock.length;
      
      this.logger.info('Using mock data', {
        count: this.products.length
      });
    } finally {
      this.loading = false;
    }
  }

  async fetchTop5Products() {
    this.loadingTop5 = true;
    try {
      this.logger.info('Fetching top 5 products...');
      
      const filter = {
        SortBy: "popular"
      };
      
      const data = await this.productService.getPagination(1, 5, filter);

      this.logger.info('Top 5 products API response', data);

      if (data && data.data && data.data.items) {
        this.top5Products = data.data.items;
      } else if (data && Array.isArray(data)) {
        this.top5Products = data.slice(0, 5);
      } else if (data && data.data.items) {
        this.top5Products = data.data.items.slice(0, 5);
      } else {
        throw new Error('Invalid API response for top 5 products');
      }

      this.logger.info('Top 5 products loaded', {
        count: this.top5Products.length,
        products: this.top5Products
      });

    } catch (error) {
      this.logger.error('Error loading top 5 products', error);
      this.top5Products = productsMock.slice(0, 5);
    } finally {
      this.loadingTop5 = false;
    }
  }

  buildFilterParams() {
    const params: any = {};

    if (this.filters.categoryId) {
      params.CategoryId = this.filters.categoryId;
    }

    if (this.filters.minPrice > 0) {
      params.MinPrice = this.filters.minPrice;
    }

    if (this.filters.maxPrice < this.priceRange.max) {
      params.MaxPrice = this.filters.maxPrice;
    }

    if (this.filters.minRating) {
      params.MinRating = this.filters.minRating;
    }

    if (this.filters.sortBy) {
      params.SortBy = this.filters.sortBy;
    }

    return params;
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  async applyFilters() {
    this.logger.info('Applying filters', this.filters);
    this.page = 1;
    await this.fetchProducts();
    this.showFilterPanel = false;
  }

  async resetFilters() {
    this.logger.info('Resetting filters');
    this.filters = {
      categoryId: null,
      minPrice: 0,
      maxPrice: 100000000,
      minRating: null,
      sortBy: ''
    };
    this.page = 1;
    await this.fetchProducts();
  }

  formatPrice(price: number): string {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + ' triệu';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'k';
    }
    return price.toString();
  }

  get totalProducts(): number {
    return this.totalItems;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  async changePage(p: number) {
    if (p < 1 || p > this.totalPages || p === this.page) {
      return;
    }
    
    this.logger.info('Changing page', { from: this.page, to: p });
    this.page = p;
    await this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleAddToCart(product: ProductSummaryDto) {
    this.logger.info('Add to cart clicked', product);
  }

  handleAddToFavorite(product: ProductSummaryDto) {
    this.logger.info('Add to favorite clicked', product);
  }

  shouldShowPage(pageNum: number): boolean {
    const total = this.totalPages;
    if (total <= 7) return true;
    if (pageNum === 1 || pageNum === total) return true;
    if (Math.abs(pageNum - this.page) <= 1) return true;
    return false;
  }

  shouldShowEllipsis(pageNum: number): boolean {
    const total = this.totalPages;
    if (total <= 7) return false;
    if (pageNum === 2 && this.page > 4) return true;
    if (pageNum === total - 1 && this.page < total - 3) return true;
    return false;
  }
}