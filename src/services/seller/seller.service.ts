import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { HelperService } from "src/helpers/hepler.service";
import { axiosInstance } from "src/configs/axiosInstance";
import { SellerRegistrationResponseDto } from "@dtos/seller/seller.response.dto";
import { sellerRegistrationRequestDto } from "@dtos/seller/seller.request.dto";
import { ApiPaginationResponseDto } from "@dtos/api/api.response.dto";
import {
  SellerOrderDto,
  BackendOrderDto,
  SellerOrderApiResponse,
  OrderStatus
} from "@dtos/order/order";

@Injectable({
  providedIn: "root",
})
export class SellerService {
  endPoint: string = "/seller";
  constructor(
    private readonly helper: HelperService,
    private readonly logger: NGXLogger
  ) {
  }

  async register(sellerRequestDto: sellerRegistrationRequestDto): Promise<SellerRegistrationResponseDto> {
    this.logger.debug(`endPoint: ${this.endPoint}/registration`);
    try {
      const res = await axiosInstance.post(`${this.helper.getBaseUrl()}${this.endPoint}/registration`, sellerRequestDto);
      return res.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async getSellerOrders(status: OrderStatus, pageNumber: number = 1, pageSize: number = 20): Promise<ApiPaginationResponseDto<SellerOrderDto>> {
    this.logger.debug(`Đang tải đơn hàng: status=${status}, page=${pageNumber}`);
    try {
      const res = await axiosInstance.get<SellerOrderApiResponse>(
        `${this.helper.getBaseUrl()}${this.endPoint}/orders`,
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
          data: {
            items: [],
            pageNumber: 1,
            pageSize: pageSize,
            totalCount: 0,
            totalPage: 0
          },

        };
      }

      const mappedItems = backendPagedData.items.map((order: BackendOrderDto) => this.mapBackendOrderToFrontend(order));

      const frontendResponse: ApiPaginationResponseDto<SellerOrderDto> = {
        isSuccess: backendResponse.isSuccess,
        code: backendResponse.code,
        message: backendResponse.message,
        data: {
          items: mappedItems,
          pageNumber: backendResponse.data.pageNumber,
          pageSize: backendResponse.data.pageSize,
          totalCount: backendResponse.data.totalCount,
          totalPage: backendResponse.data.totalPage
        },

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

  async updateOrderStatus(orderId: number, newStatus: OrderStatus): Promise<boolean> {
    this.logger.debug(`Yêu cầu cập nhật đơn hàng #${orderId} sang ${newStatus}.`);

    const requestBody = {
      NewStatus: newStatus
    };
    try {
      const res = await axiosInstance.patch<ApiPaginationResponseDto<any>>(
        `${this.helper.getBaseUrl()}${this.endPoint}/orders/${orderId}/status`,
        requestBody
      );
      if (res.data.isSuccess) {
        return true;
      }
      throw new Error(res.data.message || "Cập nhật thất bại");
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật trạng thái đơn hàng #${orderId}.`, error);
      throw this.helper.ThrowError(error);
    }
  }
}