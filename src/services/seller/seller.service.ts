import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { HelperService } from "src/helpers/hepler.service";
import { axiosInstance } from "src/configs/axiosInstance";
import { SellerRegistrationResponseDto } from "@dtos/seller/seller.response.dto";
import { sellerRegistrationRequestDto } from "@dtos/seller/seller.request.dto";
import { ApiPaginationResponseDto } from "@dtos/api/api.response.dto"; 

export type OrderStatus = 'Pending' | 'Shipping' | 'Completed' | 'Cancelled';

export interface SellerOrderItemDto {
  productName: string;
  imageUrl: string;
  variantInfo: string;
  quantity: number;
  unitPrice: number;
}
export interface SellerOrderDto {
  orderId: number;
  customerName: string;
  phone: string;
  shippingAddress: string;
  orderDate: string;
  status: OrderStatus;
  totalAmountForSeller: number;
  items: SellerOrderItemDto[];
}
interface BackendOrderItemDto {
  productName: string;
  imageUrl: string;
  variantName: string; 
  quantity: number;
  price: number; 
}
interface BackendOrderDto {
  id: number; 
  shippingName: string; 
  shippingPhone: string; 
  shippingAddress: string;
  createdAt: string; 
  status: OrderStatus;
  totalAmount: number; 
  items: BackendOrderItemDto[];
}


@Injectable({
  providedIn: "root",
})
export class SellerService {
  endPoint: string = "http://localhost:8080/api/sellers";

  constructor(
    private readonly helper: HelperService,
    private readonly logger: NGXLogger
  ) {
  }

  async register(sellerRequestDto: sellerRegistrationRequestDto): Promise<SellerRegistrationResponseDto> {
    this.logger.debug(`endPoint: ${this.endPoint}/registration`);
    try {
      const res = await axiosInstance.post(`${this.endPoint}/registration`, sellerRequestDto);
      return res.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async getSellerOrders(status: OrderStatus, pageNumber: number = 1, pageSize: number = 20): Promise<ApiPaginationResponseDto<SellerOrderDto>> {
    this.logger.debug(`Đang tải đơn hàng: status=${status}, page=${pageNumber}`);
    try {
      const res = await axiosInstance.get<any>(
        `${this.endPoint}/orders`, 
        {
          params: {
            status: status,
            pageNumber: pageNumber,
            pageSize: pageSize
          }
        }
      );

      const backendResponse = res.data;
      const backendPagedData = backendResponse.data;

      if (!backendPagedData || !backendPagedData.items) {
        this.logger.warn('API trả về data null hoặc không có items, trả về mảng rỗng.');
        return {
          isSuccess: backendResponse.isSuccess,
          code: backendResponse.code,
          message: backendResponse.message,
          data: { items: [] },
          pageNumber: 1,
          pageSize: pageSize,
          totalCount: 0,
          totalPage: 0
        };
      }

      const mappedItems = backendPagedData.items.map((order: BackendOrderDto) => 
        this.mapBackendOrderToFrontend(order)
      );

      const frontendResponse: ApiPaginationResponseDto<SellerOrderDto> = {
        isSuccess: backendResponse.isSuccess,
        code: backendResponse.code,
        message: backendResponse.message,
        data: { 
          items: mappedItems 
        },
        pageNumber: backendPagedData.pageNumber,
        pageSize: backendPagedData.pageSize,
        totalCount: backendPagedData.totalCount,
        totalPage: backendPagedData.totalPages 
      };

      return frontendResponse;

    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  private mapBackendOrderToFrontend(order: BackendOrderDto): SellerOrderDto {
    return {
      orderId: order.id,
      customerName: order.shippingName,
      phone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      orderDate: order.createdAt,
      status: order.status,
      totalAmountForSeller: order.totalAmount,
      items: order.items.map(item => ({
        productName: item.productName,
        imageUrl: item.imageUrl,
        variantInfo: item.variantName, 
        quantity: item.quantity,
        unitPrice: item.price 
      }))
    };
  }

  async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<any> {
    this.logger.warn(`(CHỨC NĂNG CHƯA HOÀN THIỆN) Yêu cầu cập nhật đơn hàng #${orderId} sang ${newStatus}. API backend chưa tồn tại.`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true; 
  }
}