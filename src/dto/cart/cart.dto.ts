import { CartProductVariantDto } from "@dtos/product-variant/product-variant";

export interface CartItemDto {
  id: number;
  variantId: number;
  quantity: number;
  productName: string;
  variantSize: string;
  color: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface CartShopDto {
  shopId: number,
  shopName: string,
  subTotalPrice: number
  items: CartProductVariantDto[],

}