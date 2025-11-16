
import { Injectable } from "@angular/core";
import { ApiPaginationResponseDto } from "@dtos/api/api.response.dto";
import { CustomerOrderResponseDto } from "@dtos/order-customer/CustomerOrder.response.dto";
import { CustomerOrderDetailResponseDto } from "@dtos/order-customer/CustomerOrderDetail.response";
import { CustomerCancelOrderRequestDto } from "@dtos/order-customer/CustomerCancelOrder.request.dto";
import { CustomerOrderFilterDto } from "@dtos/order-customer/CustomerOrderFilter.dto";
import { NGXLogger } from "ngx-logger";
import { Observable } from "rxjs";
import { HelperService } from "src/helpers/hepler.service";
import { axiosInstance } from "src/configs/axiosInstance";

// Đây là một lớp Service (dịch vụ) giả lập
// Lớp này sẽ gọi API (ví dụ: dùng fetch hoặc axios) để lấy dữ liệu.
// Dữ liệu mock đã được cập nhật theo model mới (dựa trên SQL).
@Injectable({
    providedIn: 'root'
})
export class CustomerOrderService {
    endPoint: string = "/customer/orders";

    constructor(
        private readonly helper: HelperService,
        private readonly logger: NGXLogger
    ) { }

    /**
     * Lấy lịch sử đơn hàng của Customer với filter + phân trang
     */
    async getMyOrders(status?: CustomerOrderFilterDto,pageNumber: number = 1,pageSize: number = 20): Promise<ApiPaginationResponseDto<CustomerOrderResponseDto>> {
        this.logger.debug(`Đang tải đơn hàng customer: status=${status}, page=${pageNumber}`);
        try {
            const res = await axiosInstance.get<ApiPaginationResponseDto<CustomerOrderResponseDto>>(`${this.helper.getBaseUrl()}${this.endPoint}`,
                {
                    params: {
                        status,
                        pageNumber,
                        pageSize
                    }
                }
            );

            const data = res.data;
            if (!data || !data.data?.items) {
                this.logger.warn('API trả về data null hoặc không có items, trả về mảng rỗng.');
                return {
                    isSuccess: data?.isSuccess ?? false,
                    code: data?.code ?? '500',
                    message: data?.message ?? 'Không có dữ liệu',
                    data: { items: [] },
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    totalCount: 0,
                    totalPage: 0
                };
            }

            return data;

        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    /**
     * Lấy chi tiết đơn hàng
     */
    async getOrderDetail(orderId: number): Promise<CustomerOrderDetailResponseDto> {
        this.logger.debug(`Đang tải chi tiết đơn hàng #${orderId}`);
        try {
            const res = await axiosInstance.get<CustomerOrderDetailResponseDto>(
                `${this.helper.getBaseUrl()}${this.endPoint}/${orderId}`
            );
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    /**
     * Hủy đơn hàng pending
     */
    async cancelOrder(orderId: number, cancelRequest: CustomerCancelOrderRequestDto): Promise<CustomerOrderResponseDto> {
        this.logger.debug(`Hủy đơn hàng #${orderId}`);
        try {
            const res = await axiosInstance.post<CustomerOrderResponseDto>(
                `${this.helper.getBaseUrl()}${this.endPoint}/${orderId}/cancel`,
                cancelRequest
            );
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    /**
     * Xác nhận đã nhận hàng
     */
    async confirmDelivery(orderId: number): Promise<CustomerOrderResponseDto> {
        this.logger.debug(`Xác nhận đã nhận hàng cho đơn #${orderId}`);
        try {
            const res = await axiosInstance.post<CustomerOrderResponseDto>(
                `${this.helper.getBaseUrl()}${this.endPoint}/${orderId}/confirm-delivery`,
                {}
            );
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}
