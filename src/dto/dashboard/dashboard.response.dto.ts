// DTO cho các thẻ tổng quan
export interface DashboardSummaryResponse {
  totalRevenue: number,
  totalValidOrders: number,
  totalUnitsSold: number,
  newCustomers: number;
}

// DTO cho biểu đồ doanh thu/đơn hàng theo thời gian
export interface SalesOverTimeResponse {
  date: string, // Giả sử DateOnly được serialize thành string 'YYYY-MM-DD'
  revenue: number,
  orderCount: number;
}

// DTO cho top sản phẩm bán chạy.
export interface TopProductResponse {
  productId: number,
  productName: string,
  unitsSold: number,
  totalRevenue: number;
}

// DTO cho doanh thu theo danh mục (dùng cho biểu đồ tròn).
export interface CategorySalesResponse  {
  categoryName: string,
  unitSold: null,
  totalRevenue: number;
}

// DTO cho danh sách các đơn hàng gần đây.
export interface RecentOrderResponse {
  orderId: number,
  customerName: string,
  orderDate: string, // Giả sử DateTime được serialize thành ISO string
  totalAmount: number,
  status: string;
}