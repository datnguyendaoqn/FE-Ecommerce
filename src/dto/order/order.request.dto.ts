export interface OrderRequestDto {
    addressBookId: number,
    paymentMethod: string,
    shopNotes: {
        shopId: number,
        note: string
    }[],
    tickedVariantIds: number[]
}