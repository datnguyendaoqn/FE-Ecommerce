import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { HelperService } from "src/helpers/hepler.service";
import { BaseApiService } from "../api.service";
import { axiosInstance } from "src/configs/axiosInstance";

import { SellerProductSummaryApiResponseDto, SellerProductSummaryDto } from "@dtos/product/seller-product-summary.dto";
import { SellerProductDetailApiResponseDto, SellerProductDetailDto } from "@dtos/product/seller-product-detail.dto";
import { CreateProductApiResponseDto, CreateProductResponseDto } from "@dtos/product/create-product.response.dto";
import { UpdateProductRequestDto } from "@dtos/product/update-product.request.dto";
import { UpdateProductApiResponseDto, UpdateProductResponseDto } from "@dtos/product/update-product.response.dto";
import { ApiResponseDto } from "@dtos/api/api.response.dto";

@Injectable({
    providedIn: "root",
})
export class SellerProductService extends BaseApiService<any, any> {

    constructor(
        protected override readonly helper: HelperService,
        protected override readonly logger: NGXLogger
    ) {
        super("/products", helper, logger);
    }


    async getMyProducts(): Promise<SellerProductSummaryDto[]> {
        try {
            const res = await axiosInstance.get<SellerProductSummaryApiResponseDto>(`${this.endpoint}/my-shop`);
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async getProductDetail(productId: number): Promise<SellerProductDetailDto> {
        try {
            const res = await axiosInstance.get<SellerProductDetailApiResponseDto>(`${this.endpoint}/${productId}`);
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async createProduct(formData: FormData): Promise<CreateProductResponseDto> {
        try {
            const res = await axiosInstance.post<CreateProductApiResponseDto>(
                this.endpoint, 
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async updateProduct(productId: number, dto: UpdateProductRequestDto): Promise<UpdateProductResponseDto> {
        try {
            const res = await axiosInstance.put<UpdateProductApiResponseDto>(
                `${this.endpoint}/${productId}`,
                dto
            );
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async deleteProduct(productId: number): Promise<ApiResponseDto> {
        try {
            const res = await axiosInstance.delete<ApiResponseDto>(`${this.endpoint}/${productId}`);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async addVariant(productId: number, formData: FormData): Promise<any> {
        try {
            const res = await axiosInstance.post<ApiResponseDto & { data: any }>(
                `${this.endpoint}/${productId}/variants`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async updateVariant(productId: number, variantId: number, dto: any): Promise<any> {
        try {
            const res = await axiosInstance.put<ApiResponseDto & { data: any }>(
                `${this.endpoint}/${productId}/variants/${variantId}`,
                dto
            );
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async deleteVariant(productId: number, variantId: number): Promise<ApiResponseDto> {
        try {
            const res = await axiosInstance.delete<ApiResponseDto>(
                `${this.endpoint}/${productId}/variants/${variantId}`
            );
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async addGalleryImages(productId: number, formData: FormData): Promise<any> {
        try {
            const res = await axiosInstance.post<ApiResponseDto & { data: any }>(
                `/medias/product/${productId}/add-gallery`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }

    async deleteMedia(mediaId: number): Promise<ApiResponseDto> {
        try {
            const res = await axiosInstance.delete<ApiResponseDto>(`/medias/${mediaId}`);
            return res.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}