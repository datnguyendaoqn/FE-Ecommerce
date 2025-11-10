export interface CreateVariantRequestDto {
  sku: string;
  variantSize: string | null;
  color: string | null;
  price: number;
  quantity: number;
  image: File;
}

export interface CreateProductRequestDto {
  name: string;
  description: string | null;
  brand: string | null;
  categoryId: number;
  variants: CreateVariantRequestDto[];
  productImages: File[] | null;
}