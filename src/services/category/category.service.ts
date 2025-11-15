import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { HelperService } from "src/helpers/hepler.service";
import { BaseApiService } from "../api.service";
import { axiosInstance } from "src/configs/axiosInstance";
import { CategoryApiResponseDto, RecursiveCategoryDto } from "@dtos/category/category.dto";
import { CategoryDto } from "@dtos/category/category";

@Injectable({
    providedIn: "root",
})
export class CategoryService extends BaseApiService<CategoryDto, CategoryApiResponseDto> {

    constructor(
        protected override readonly helper: HelperService,
        protected override readonly logger: NGXLogger
    ) {
        super("/categories", helper, logger);
    }

    async getAllCategories(): Promise<RecursiveCategoryDto[]> {
        try {
            const res = await axiosInstance.get<CategoryApiResponseDto>(this.endpoint);
            return res.data.data;
        } catch (error) {
            throw this.helper.ThrowError(error);
        }
    }
}