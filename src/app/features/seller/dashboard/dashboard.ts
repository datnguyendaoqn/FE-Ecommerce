import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { DashboardService } from 'src/services/seller-dashboard/Dashboard.service';
import {
  CategorySalesResponse,
  DashboardSummaryResponse,
  RecentOrderResponse,
  SalesOverTimeResponse,
  TopProductResponse,
} from '@dtos/dashboard/dashboard.response.dto';
@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    CurrencyPipe,
    DatePipe,
  ],
  providers: [
    DashboardService,
    DatePipe,
  ],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private datePipe = inject(DatePipe);

  // Filters
  public fromDate: string;
  public toDate: string;
  public topNCount: number = 5;
  public recentOrdersCount: number = 10;

  // Data
  public summary?: DashboardSummaryResponse;
  public topProducts: TopProductResponse[] = [];
  public recentOrders: RecentOrderResponse[] = [];

  // Loading
  public isLoadingSummary = false;
  public isLoadingSalesOverTime = false;
  public isLoadingTopProducts = false;
  public isLoadingCategorySales = false;
  public isLoadingRecentOrders = false;
  public errorMessage?: string;

  // Bar chart
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, ticks: { color: '#6b7280' } }, x: { ticks: { color: '#6b7280' } } },
    plugins: { legend: { position: 'top', labels: { color: '#111827' } } },
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Doanh thu', backgroundColor: '#3b82f6' },
      { data: [], label: 'Đơn hàng', backgroundColor: '#a855f7' },
    ],
  };

  // Pie chart
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top', labels: { color: '#111827' } } },
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#f97316'],
        hoverBackgroundColor: ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#ea580c'],
      },
    ],
  };

  constructor() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.toDate = this.formatDateForInput(today);
    this.fromDate = this.formatDateForInput(thirtyDaysAgo);
  }

  ngOnInit(): void {
    this.loadAllDashboardData();
  }

  private formatDateForInput(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  public async loadAllDashboardData(): Promise<void> {
    this.errorMessage = undefined;
    this.isLoadingSummary = this.isLoadingSalesOverTime = this.isLoadingCategorySales = true;
    this.isLoadingTopProducts = this.isLoadingRecentOrders = true;

    try {
      await Promise.all([
        this.loadSummary(this.fromDate, this.toDate),
        this.loadSalesOverTime(this.fromDate, this.toDate),
        this.loadSalesByCategory(this.fromDate, this.toDate),
        this.loadTopProducts(this.fromDate, this.toDate, this.topNCount),
        this.loadRecentOrders(this.recentOrdersCount),
      ]);
    } catch (error) {
      console.error('Một hoặc nhiều tác vụ dashboard đã thất bại', error);
    }
  }

  async loadSummary(from: string, to: string): Promise<void> {
    this.isLoadingSummary = true;
    try {
      // DÙNG AWAIT ĐỂ LẤY DỮ LIỆU
      const data = await this.dashboardService.getDashboardSummary({ from, to });
      // SỬA LỖI 17: Gán 'data' (là DashboardSummary) cho 'this.summary'
      this.summary = data; 
    } catch (err) {
      this.handleError(err, 'tổng quan');
    } finally {
      this.isLoadingSummary = false;
    }
  }

  async loadSalesOverTime(from: string, to: string): Promise<void> {
    this.isLoadingSalesOverTime = true;
    try {
      // DÙNG AWAIT ĐỂ LẤY DỮ LIỆU
      const data = await this.dashboardService.getSalesOverTime({ from, to });
      // SỬA LỖI 18: Gán 'data' (là SalesOverTime[]) cho 'this.updateBarChart'
      this.updateBarChart(data);
    } catch (err) {
      this.handleError(err, 'doanh thu theo thời gian');
    } finally {
      this.isLoadingSalesOverTime = false;
    }
  }

  async loadTopProducts(from: string, to: string, topN: number): Promise<void> {
    this.isLoadingTopProducts = true;
    try {
      // DÙNG AWAIT ĐỂ LẤY DỮ LIỆU
      const data = await this.dashboardService.getTopProducts({ from, to, topN });
      // SỬA LỖI 19: Gán 'data' (là TopProduct[]) cho 'this.topProducts'
      this.topProducts = data;
    } catch (err) {
      this.handleError(err, 'sản phẩm bán chạy');
    } finally {
      this.isLoadingTopProducts = false;
    }
  }

  async loadSalesByCategory(from: string, to: string): Promise<void> {
    this.isLoadingCategorySales = true;
    try {
      // DÙNG AWAIT ĐỂ LẤY DỮ LIỆU
      const data = await this.dashboardService.getCategorySales({ from, to });
      // SỬA LỖI 20: Gán 'data' (là CategorySales[]) cho 'this.updatePieChart'
      this.updatePieChart(data);
    } catch (err) {
      this.handleError(err, 'doanh thu theo danh mục');
    } finally {
      this.isLoadingCategorySales = false;
    }
  }

  async loadRecentOrders(count: number): Promise<void> {
    this.isLoadingRecentOrders = true;
    try {
      // DÙNG AWAIT ĐỂ LẤY DỮ LIỆU
      const data = await this.dashboardService.getRecentOrders({ count });
      // SỬA LỖI 21: Gán 'data' (là RecentOrder[]) cho 'this.recentOrders'
      this.recentOrders = data;
    } catch (err) {
      this.handleError(err, 'đơn hàng gần đây');
    } finally {
      this.isLoadingRecentOrders = false;
    }
  }
  private updateBarChart(data: SalesOverTimeResponse[]): void {
    this.barChartData = {
      labels: data.map(d => d.date),
      datasets: [
        { data: data.map(d => d.revenue), label: 'Doanh thu', backgroundColor: '#3b82f6' },
        { data: data.map(d => d.orderCount), label: 'Đơn hàng', backgroundColor: '#a855f7' },
      ],
    };
  }

  private updatePieChart(data: CategorySalesResponse[]): void {
    this.pieChartData = {
      labels: data.map(d => d.categoryName),
      datasets: [
        {
          data: data.map(d => d.totalRevenue),
          backgroundColor: this.pieChartData.datasets[0].backgroundColor,
          hoverBackgroundColor: this.pieChartData.datasets[0].hoverBackgroundColor,
        },
      ],
    };
  }

  private handleError(error: any, context: string): void {
    console.error(`Error loading ${context}:`, error);
    this.errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
  }
}
