/**
 * Payment and Transaction Types
 */

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceName?: string; // Service title/name for display
  packageId: string;
  packageName: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "expired";
  paymentMethod: "tripay" | "wa";
  merchantRef: string;
  tripayRef?: string;
  createdAt: string;
  paidAt?: string;
  expiryTime?: string;
}

export interface TripayPayload {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_items: TripayOrderItem[];
  return_url: string;
  expired_time: number;
  signature: string;
}

export interface TripayOrderItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TripayCallbackBody {
  status: "PAID" | "EXPIRED" | "FAILED";
  merchant_ref: string;
  customer_name: string;
  total_amount: number;
  paid_amount?: number;
  payment_method?: string;
  reference?: string;
  timestamp?: number;
}

export interface TripayCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
  detail?: string;
}

export interface UserSubscription {
  userId: string;
  serviceId: string;
  serviceName?: string; // Service title/name for display
  packageName: string;
  purchasedAt: string;
  expiresAt?: string;
  status: "active" | "expired" | "canceled";
}
