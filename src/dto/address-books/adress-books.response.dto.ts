import { ApiResponseDto } from "@dtos/api/api.response.dto";
import { AddressBooks } from "./address-books";

export interface AddressBooksResponseDto extends ApiResponseDto {
    data: AddressBooks[]
}