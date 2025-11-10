import { ReviewResponseDto } from "@dtos/review/review";

export const reviewMocks: ReviewResponseDto[] = [
    {
        id: 1,
        authorName: 'Nguyễn V** A',
        rating: 4.5,
        comment: 'Áo đẹp, chất vải mềm mịn. Giao hàng nhanh.',
        createdAt: '2025-11-05T12:00:00Z',
        variantInfo: 'Màu: Đen, Size: M',
    },
    {
        id: 2,
        authorName: 'Trần T** B',
        rating: 5,
        comment: 'Rất ưng ý, mặc vừa vặn và thoáng mát.',
        createdAt: '2025-11-03T08:30:00Z',
        variantInfo: 'Màu: Trắng, Size: L',
    },
]