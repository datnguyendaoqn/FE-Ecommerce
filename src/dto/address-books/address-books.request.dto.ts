export interface AddressBooksRequestDto {
    fullName: string,
    phone: string,
    addressLine: string,
    provinceCode: string,
    districtCode: string,
    wardCode: string,
    isDefault: boolean
}