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
import { CategoryDto } from '@dtos/category/category';
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
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    'https://images.unsplash.com/photo-1521334884684-d80222895322',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
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
  filteredProducts: ProductSummaryDto[] = [];
  loading = false;
  page = 1;
  pageSize = 8;
  totalItems = 0;
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
    max: 100000000, // 100 triệu
    step: 100000 // Bước nhảy 100k
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
    await this.fetchCategories();
    await this.fetchProducts();
    await this.fetchTop5Products()
  }

  get paginatedProducts(): ProductSummaryDto[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.products.slice(start, end);
  }


  async fetchCategories() {
    try {
      const res = await this.categoryService.getAllCategories();

      // Chuyển RecursiveCategoryDto[] -> CategoryDto[]
      this.categories = this.flattenCategories(res);

      this.logger.info('Đã tải categories từ API', this.categories);
    } catch (error) {
      this.logger.error('Lỗi khi tải categories', error);
    }
  }

  flattenCategories(categories: RecursiveCategoryDto[], level: number = 0): FlatCategory[] {
    let result: FlatCategory[] = [];
    categories.forEach((cat) => {
      // Push category với children = [] và thêm level
      result.push({
        ...cat,
        children: [],
        level: level  // Thêm level vào object
      });

      // Nếu có children, flatten đệ quy với level + 1
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
    try {
      // Build filter object
      const filterParams = this.buildFilterParams();
      this.logger.debug("Filter hiện tại: ", filterParams)
      const data = await this.productService.getPagination(
        this.page,
        this.pageSize,
        filterParams
      );

      this.logger.info('Đã tải sản phẩm từ API', data);

      if (data && data.data) {
        this.products = data.data.items || [];
        this.totalItems = data.totalCount || this.products.length;
      } else {
        this.products = [];
        this.totalItems = 0;
      }

    } catch (error) {
      this.logger.error('Lỗi khi tải sản phẩm, fallback sang mock', error);
      this.products = productsMock;
      this.totalItems = productsMock.length;
    } finally {
      this.loading = false;
    }
  }

  async fetchTop5Products() {
    this.loading = true;
    try {
      const filter = {
        SortBy: "popular"
      }
      const data = await this.productService.getPagination(
        this.page,
        5,
        filter
      );

      if (data && data.data) {
        this.top5Products = data.data.items || [];
        this.totalItems = data.totalCount || this.products.length;
      } else {
        this.top5Products = [];
        this.totalItems = 0;
      }

    } catch (error) {
      this.logger.error('Lỗi khi tải sản phẩm, fallback sang mock', error);
      this.top5Products = productsMock.slice(0, 5);
      this.totalItems = productsMock.length;
    } finally {
      this.loading = false;
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
    this.page = 1; // Reset to first page
    await this.fetchProducts();
    this.showFilterPanel = false;
  }

  async resetFilters() {
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

  // Format price for display
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

  async changePage(p: number) {
    this.page = p;
    await this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleAddToCart(product: ProductSummaryDto) {
    this.logger.info('Click vào giỏ hàng', product);
  }

  handleAddToFavorite(product: ProductSummaryDto) {
    this.logger.info('Click vào yêu thích', product);
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