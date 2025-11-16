// Dùng cho hầu hết các API (Summary, SalesOverTime, SalesByCategory)
export interface DashboardRequest {
  from?: string; // 'YYYY-MM-DD'
  to?: string;   // 'YYYY-MM-DD'
  count?: number;
  topN?: number;
}