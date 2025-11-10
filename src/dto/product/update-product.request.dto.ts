export interface UpdateProductRequestDto {
  name: string;
  description: string | null;
  brand: string | null;
  categoryId: number;
}