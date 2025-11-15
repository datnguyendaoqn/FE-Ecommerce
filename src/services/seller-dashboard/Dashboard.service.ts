import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { HelperService } from 'src/helpers/hepler.service';
import { axiosInstance } from 'src/configs/axiosInstance';

// CẬP NHẬT: Import đúng tên DTOs từ tệp Response
import {
  DashboardSummaryResponse,
  SalesOverTimeResponse,
  TopProductResponse,
  CategorySalesResponse,
  RecentOrderResponse
} from '@dtos/dashboard/dashboard.response.dto';
import { DashboardRequest } from '@dtos/dashboard/dashboard.request.dto';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  endPoint: string = "http://localhost:8080/api/dashboard";
  constructor(
        private readonly helper: HelperService,
        private readonly logger: NGXLogger
    ) {
    }
    async getDashboardSummary(dashboardRequest: DashboardRequest ): Promise<DashboardSummaryResponse> {
        this.logger.debug(`endPoint: ${this.endPoint}/summary`);
        try {
            const res = await axiosInstance.get(`${this.endPoint}/summary`, { params: dashboardRequest }); 
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    };
    async getSalesOverTime(dashboardRequest: DashboardRequest): Promise<SalesOverTimeResponse[]> {
        this.logger.debug(`endPoint: ${this.endPoint}/sales-over-time`);
        try {
            const res = await axiosInstance.get(`${this.endPoint}/sales-over-time`, { params: dashboardRequest }); 
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
      };
    async getTopProducts(dashboardRequest: DashboardRequest): Promise<TopProductResponse[]> {
        this.logger.debug(`endPoint: ${this.endPoint}/top-products`);   
        try {
            const res = await axiosInstance.get(`${this.endPoint}/top-products`, { params: dashboardRequest }); 
            return res.data;
        } catch (error) {     
            throw this.helper.ThrowError(error);
        }
      };
    async getCategorySales(dashboardRequest: DashboardRequest): Promise<CategorySalesResponse[]> {
        this.logger.debug(`endPoint: ${this.endPoint}/sales-by-category`);   
        try {
            const res = await axiosInstance.get(`${this.endPoint}/sales-by-category`, { params: dashboardRequest }); 
            return res.data;
        } catch (error) {     
            throw this.helper.ThrowError(error);
        }
      };
    async getRecentOrders(dashboardRequest: DashboardRequest): Promise<RecentOrderResponse[]> {
        this.logger.debug(`endPoint: ${this.endPoint}/recent-orders`);   
        try {
            const res = await axiosInstance.get(`${this.endPoint}/recent-orders`, { params: dashboardRequest }); 
            return res.data;
        } catch (error) {     
            throw this.helper.ThrowError(error);
        }
      };
} 
