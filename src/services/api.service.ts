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

  protected get baseUrl() {
    return this.helper.getBaseUrl();
  }

  async getAll(): Promise<ResponseDto[]> {
    try {
      const res = await axiosInstance.get<{ data: ResponseDto[] }>(
        `${this.baseUrl}${this.endpoint}`
      );
      this.logger.debug(`GET ALL → ${this.baseUrl}${this.endpoint}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async getById<T = ResponseDto>(id: number): Promise<T> {
    try {
      const res = await axiosInstance.get<{ data: T }>(
        `${this.baseUrl}${this.endpoint}/${id}`
      );
      this.logger.debug(`GET BY ID → ${this.baseUrl}${this.endpoint}/${id}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async getPagination(pageNumber = 1, pageSize = 10): Promise<PaginationResponseDto> {
    try {
      const res = await axiosInstance.post(
        `${this.baseUrl}${this.endpoint}/pagination`,
        {
          pageNumber,
          pageSize
        }
      );
      this.logger.debug(`GET PAGINATION → ${this.baseUrl}${this.endpoint}/pagination`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async create(dto: RequestDto): Promise<ResponseDto> {
    try {
      const res = await axiosInstance.post(
        `${this.baseUrl}${this.endpoint}`,
        dto
      );
      this.logger.debug(`CREATE → ${this.baseUrl}${this.endpoint}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async update(id: string | number, dto: Partial<RequestDto>): Promise<ResponseDto> {
    try {
      const res = await axiosInstance.put(
        `${this.baseUrl}${this.endpoint}/${id}`,
        dto
      );
      this.logger.debug(`UPDATE → ${this.baseUrl}${this.endpoint}/${id}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}${this.endpoint}/${id}`);
      this.logger.debug(`DELETE → ${this.baseUrl}${this.endpoint}/${id}`);
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }
}
