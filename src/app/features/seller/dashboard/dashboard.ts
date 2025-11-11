import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, Injectable } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// =======================================================================
// 1. ĐỊNH NGHĨA CÁC DTO (Interfaces)
// =======================================================================
// Các interface này khớp với DTOs ở backend của bạn

export interface DashboardSummaryDTO {
  totalRevenue: number;
  totalValidOrders: number;
  totalUnitsSold: number;
  newCustomers: number;
}

export interface SalesOverTimeDTO {
  date: string; // ISO date string (ví dụ: "2024-10-27")
  revenue: number;
  orderCount: number;
}

export interface TopProductDTO {
  productId: number;
  productName: string;
  unitsSold: number;
  totalRevenue: number;
}

export interface CategorySalesDTO {
  categoryName: string;
  totalRevenue: number;
}

export interface RecentOrderDTO {
  orderId: number;
  customerName: string;
  orderDate: string; // ISO date string
  totalAmount: number;
  status: string;
}

// =======================================================================
// 2. DỊCH VỤ (SERVICE) ĐỂ GỌI API
// =======================================================================
// Service này được cung cấp ngay trong component
@Injectable() 
export class DashboardService {
  private http = inject(HttpClient);
  private baseUrl = '/api/dashboard'; // URL API cơ sở của bạn

  // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ĐỂ PREVIEW ---
  // Xóa phần này và bỏ comment các hàm http.get() khi dùng API thật

  private MOCK_SUMMARY: DashboardSummaryDTO = {
    totalRevenue: 1_250_000_000,
    totalValidOrders: 1320,
    totalUnitsSold: 2890,
    newCustomers: 78,
  };

  private MOCK_SALES_OVER_TIME: SalesOverTimeDTO[] = [
    { date: '2024-10-21', revenue: 15_000_000, orderCount: 12 },
    { date: '2024-10-22', revenue: 22_000_000, orderCount: 15 },
    { date: '2024-10-23', revenue: 18_000_000, orderCount: 14 },
    { date: '2024-10-24', revenue: 30_000_000, orderCount: 20 },
    { date: '2024-10-25', revenue: 25_000_000, orderCount: 18 },
    { date: '2024-10-26', revenue: 42_000_000, orderCount: 25 },
    { date: '2024-10-27', revenue: 35_000_000, orderCount: 22 },
  ];

  private MOCK_TOP_PRODUCTS: TopProductDTO[] = [
    { productId: 1, productName: 'Áo Sơ Mi Nam Vải Lụa', unitsSold: 520, totalRevenue: 250_000_000 },
    { productId: 2, productName: 'Quần Jeans Nữ Skinny', unitsSold: 310, totalRevenue: 180_000_000 },
    { productId: 3, productName: 'Giày Thể Thao Chạy Bộ', unitsSold: 150, totalRevenue: 120_000_000 },
    { productId: 4, productName: 'Đồng Hồ Thông Minh T1000', unitsSold: 80, totalRevenue: 95_000_000 },
  ];

  private MOCK_CATEGORY_SALES: CategorySalesDTO[] = [
    { categoryName: 'Thời trang Nam', totalRevenue: 450_000_000 },
    { categoryName: 'Thời trang Nữ', totalRevenue: 320_000_000 },
    { categoryName: 'Thiết bị điện tử', totalRevenue: 210_000_000 },
    { categoryName: 'Đồ gia dụng', totalRevenue: 150_000_000 },
  ];

  private MOCK_RECENT_ORDERS: RecentOrderDTO[] = [
    { orderId: 1025, customerName: 'Nguyễn Văn A', orderDate: '2024-10-27T10:30:00Z', totalAmount: 1_200_000, status: 'Completed' },
    { orderId: 1024, customerName: 'Trần Thị B', orderDate: '2024-10-27T09:15:00Z', totalAmount: 850_000, status: 'Completed' },
    { orderId: 1023, customerName: 'Lê Văn C', orderDate: '2024-10-26T15:45:00Z', totalAmount: 2_500_000, status: 'Shipping' },
    { orderId: 1022, customerName: 'Phạm Thị D', orderDate: '2024-10-26T11:20:00Z', totalAmount: 450_000, status: 'Completed' },
  ];

  // --- CÁC HÀM GỌI API THẬT ---
  // (Hiện đang dùng mock data, hãy thay thế bằng http.get)

  getSummary(from: Date, to: Date): Observable<DashboardSummaryDTO> {
    // BỎ COMMENT KHI DÙNG THẬT:
    // const params = { from: from.toISOString(), to: to.toISOString() };
    // return this.http.get<DashboardSummaryDTO>(`${this.baseUrl}/summary`, { params });
    return of(this.MOCK_SUMMARY);
  }

  getSalesOverTime(from: Date, to: Date): Observable<SalesOverTimeDTO[]> {
    // BỎ COMMENT KHI DÙNG THẬT:
    // const params = { from: from.toISOString(), to: to.toISOString() };
    // return this.http.get<SalesOverTimeDTO[]>(`${this.baseUrl}/sales-over-time`, { params });
    return of(this.MOCK_SALES_OVER_TIME);
  }

  getTopSellingProducts(from: Date, to: Date, count: number): Observable<TopProductDTO[]> {
    // BỎ COMMENT KHI DÙNG THẬT:
    // const params = { from: from.toISOString(), to: to.toISOString(), count: count.toString() };
    // return this.http.get<TopProductDTO[]>(`${this.baseUrl}/top-products`, { params });
    return of(this.MOCK_TOP_PRODUCTS);
  }

  getSalesByCategory(from: Date, to: Date): Observable<CategorySalesDTO[]> {
    // BỎ COMMENT KHI DÙNG THẬT:
    // const params = { from: from.toISOString(), to: to.toISOString() };
    // return this.http.get<CategorySalesDTO[]>(`${this.baseUrl}/sales-by-category`, { params });
    return of(this.MOCK_CATEGORY_SALES);
  }

  getRecentOrders(count: number): Observable<RecentOrderDTO[]> {
    // BỎ COMMENT KHI DÙNG THẬT:
    // const params = { count: count.toString() };
    // return this.http.get<RecentOrderDTO[]>(`${this.baseUrl}/recent-orders`, { params });
    return of(this.MOCK_RECENT_ORDERS);
  }
}

// =======================================================================
// 3. COMPONENT CHÍNH (APP-SELLER-DASHBOARD)
// =======================================================================
@Component({
  selector: 'app-seller-dashboard', // Tên component là 'app-seller-dashboard'
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule // Cần cho service
  ],
  providers: [
    DashboardService // Cung cấp service
  ],
  // THAY ĐỔI: Sử dụng template và styles (inline)
  template: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerDashboardComponent implements OnInit {
  // === 4. KHỞI TẠO STATE VÀ SERVICE ===
  private dashboardService = inject(DashboardService);

  // Tín hiệu (Signals) cho trạng thái
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Tín hiệu cho 5 nguồn dữ liệu
  summary = signal<DashboardSummaryDTO | null>(null);
  salesOverTime = signal<SalesOverTimeDTO[] | null>(null);
  topProducts = signal<TopProductDTO[] | null>(null);
  salesByCategory = signal<CategorySalesDTO[] | null>(null);
  recentOrders = signal<RecentOrderDTO[] | null>(null);

  // Tín hiệu tính toán (Computed Signals) cho biểu đồ
  // Tính toán doanh thu cao nhất để chia tỷ lệ biểu đồ
  maxRevenue = computed(() => {
    const sales = this.salesOverTime();
    if (!sales || sales.length === 0) return 1; // Tránh chia cho 0
    return Math.max(...sales.map(s => s.revenue));
  });

  // Tính tổng doanh thu của tất cả danh mục
  totalCategoryRevenue = computed(() => {
    const categories = this.salesByCategory();
    if (!categories) return 1;
    return categories.reduce((total, cat) => total + cat.totalRevenue, 0);
  });


  ngOnInit(): void {
    this.loadDashboardData();
  }

  // === 5. LOGIC TẢI DỮ LIỆU ===
  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Ngày mặc định (ví dụ: 30 ngày qua)
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);

    // Gọi tất cả 5 API song song
    forkJoin({
      summary: this.dashboardService.getSummary(from, to),
      salesOverTime: this.dashboardService.getSalesOverTime(from, to),
      topProducts: this.dashboardService.getTopSellingProducts(from, to, 5), // Lấy top 5
      salesByCategory: this.dashboardService.getSalesByCategory(from, to),
      recentOrders: this.dashboardService.getRecentOrders(5) // Lấy 5 đơn gần nhất
    }).pipe(
      tap(() => this.loading.set(false)), // Tắt loading khi xong
      catchError((err) => {
        // Xử lý lỗi
        this.error.set('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
        this.loading.set(false);
        return of(null); // Hoàn thành observable
      })
    ).subscribe((result) => {
      if (result) {
        // Cập nhật tất cả tín hiệu (signals)
        this.summary.set(result.summary);
        this.salesOverTime.set(result.salesOverTime);
        this.topProducts.set(result.topProducts);
        this.salesByCategory.set(result.salesByCategory);
        this.recentOrders.set(result.recentOrders);
      }
    });
  }
}