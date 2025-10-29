import { Injectable, Inject } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { axiosInstance } from "src/configs/axiosInstance";
import { HelperService } from "src/helpers/hepler.service";

@Injectable()
export class BaseApiService<RequestDto, ResponseDto> {
  constructor(
    @Inject(String) protected readonly endpoint: string,
    protected readonly helper: HelperService,
    protected readonly logger: NGXLogger
  ) { }

  private get baseUrl() {
    return this.helper.getBaseUrl();
  }

  async getAll(): Promise<ResponseDto[]> {
    try {
      const res = await axiosInstance.get<{ data: ResponseDto[] }>(
        `${this.baseUrl}${this.endpoint}`
      );
      this.logger.debug(`GET ALL → ${this.endpoint}`, res.data);
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
      this.logger.debug(`CREATE → ${this.endpoint}`, res.data);
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
      this.logger.debug(`UPDATE → ${this.endpoint}/${id}`, res.data);
      return res.data.data;
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}${this.endpoint}/${id}`);
      this.logger.debug(`DELETE → ${this.endpoint}/${id}`);
    } catch (error) {
      throw this.helper.ThrowError(error);
    }
  }
}
