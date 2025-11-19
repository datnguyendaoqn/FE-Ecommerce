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
  public salesOverTime: SalesOverTimeResponse[] = [];
  public categorySales: CategorySalesResponse[] = [];

  // Loading
  public isLoadingSummary = false;
  public isLoadingSalesOverTime = false;
  public isLoadingTopProducts = false;
  public isLoadingCategorySales = false;
  public isLoadingRecentOrders = false;
  public errorMessage?: string;

  // Bar chart - Improved styling
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b7280',
          font: { size: 12 }
        },
        grid: {
          color: '#f3f4f6',
        }
      },
      x: {
        ticks: {
          color: '#6b7280',
          font: { size: 11 }
        },
        grid: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#111827',
          font: { size: 12, weight: 'bold' },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Doanh thu',
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        borderSkipped: false
      },
      {
        data: [],
        label: 'Đơn hàng',
        backgroundColor: '#a855f7',
        borderRadius: 8,
        borderSkipped: false
      },
    ],
  };

  // Pie chart - Improved styling
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#111827',
          font: { size: 12, weight: 'bold' },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#3b82f6', // blue
          '#ef4444', // red
          '#22c55e', // green
          '#eab308', // yellow
          '#a855f7', // purple
          '#f97316', // orange
          '#06b6d4', // cyan
          '#ec4899'  // pink
        ],
        hoverBackgroundColor: [
          '#2563eb',
          '#dc2626',
          '#16a34a',
          '#d97706',
          '#9333ea',
          '#ea580c',
          '#0891b2',
          '#db2777'
        ],
        borderWidth: 0
      },
    ],
  };

  private updateBarChart(data: SalesOverTimeResponse[]): void {
    this.barChartData = {
      labels: data.map(d => {
        // Format date nicely
        const date = new Date(d.date);
        return this.datePipe.transform(date, 'dd/MM') || d.date;
      }),
      datasets: [
        {
          data: data.map(d => d.revenue),
          label: 'Doanh thu',
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          borderSkipped: false
        },
        {
          data: data.map(d => d.orderCount),
          label: 'Đơn hàng',
          backgroundColor: '#a855f7',
          borderRadius: 8,
          borderSkipped: false
        },
      ],
    };
  }

  private updatePieChart(data: CategorySalesResponse[]): void {
    this.pieChartData = {
      labels: data.map(d => d.categoryName),
      datasets: [
        {
          data: data.map(d => d.totalRevenue),
          label: 'Doanh thu',
          backgroundColor: this.pieChartData.datasets[0].backgroundColor,
          hoverBackgroundColor: this.pieChartData.datasets[0].hoverBackgroundColor,
          borderWidth: 0
        },
      ],
    };
  }

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
      const data = await this.dashboardService.getDashboardSummary({ from, to });
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
      const data = await this.dashboardService.getSalesOverTime({ from, to });
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
      const data = await this.dashboardService.getTopProducts({ from, to, topN });
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
      const data = await this.dashboardService.getCategorySales({ from, to });
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
      const data = await this.dashboardService.getRecentOrders({ count });
      this.recentOrders = data;
    } catch (err) {
      this.handleError(err, 'đơn hàng gần đây');
    } finally {
      this.isLoadingRecentOrders = false;
    }
  }

  private handleError(error: any, context: string): void {
    console.error(`Error loading ${context}:`, error);
    this.errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
  }
}