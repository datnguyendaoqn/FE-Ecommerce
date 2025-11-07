export interface ReviewResponseDto {
    id: number;
    authorName: string;
    rating: number;
    comment?: string;
    createdAt: string;
    variantInfo: string;
}
