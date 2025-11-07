
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