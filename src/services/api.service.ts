import { Injectable, Inject } from "@angular/core";
import { ApiPaginationResponseDto } from "@dtos/api/api.response.dto";
import { NGXLogger } from "ngx-logger";
import { axiosInstance } from "src/configs/axiosInstance";
import { HelperService } from "src/helpers/hepler.service";

@Injectable()
export class BaseApiService<RequestDto, ResponseDto, PaginationResponseDto = ApiPaginationResponseDto<ResponseDto>> {
  constructor(
    @Inject(String) protected readonly endpoint: string,
    protected readonly helper: HelperService,
    protected readonly logger: NGXLogger
  ) { }

  
  async getAll(): Promise<ResponseDto[]> {
    try {
      const res = await axiosInstance.get<{ data: ResponseDto[] }>(
        this.endpoint
      );
      this.logger.debug(`GET ALL → ${this.endpoint}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async getById<T = ResponseDto>(id: number): Promise<T> {
    try {
      const res = await axiosInstance.get<{ data: T }>(
        `${this.endpoint}/${id}`
      );
      this.logger.debug(`GET BY ID → ${this.endpoint}/${id}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async getPagination(pageNumber: number = 1, pageSize: number = 10): Promise<PaginationResponseDto> {
    try {
      const res = await axiosInstance.post(
        `${this.endpoint}/pagination`,
        {
          pageNumber,
          pageSize
        }
      );
      this.logger.debug(`GET PAGINATION → ${this.endpoint}/pagination`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async create(dto: RequestDto): Promise<ResponseDto> {
    try {
      const res = await axiosInstance.post(
        this.endpoint,
        dto
      );
      this.logger.debug(`CREATE → ${this.endpoint}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async update(id: string | number, dto: Partial<RequestDto>): Promise<ResponseDto> {
    try {
      const res = await axiosInstance.put(
        `${this.endpoint}/${id}`,
        dto
      );
      this.logger.debug(`UPDATE → ${this.endpoint}/${id}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.endpoint}/${id}`);
      this.logger.debug(`DELETE → ${this.endpoint}/${id}`);
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }
}