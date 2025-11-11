export interface ApiResponseDto {
    isSuccess?: boolean,
    code?: number | null,
    message?: string,
}

export interface ApiPaginationResponseDto<T> {
    isSuccess?: boolean,
    code?: string,
    message?: string,
    data: {
        items: T[]
    },
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPage: number
}