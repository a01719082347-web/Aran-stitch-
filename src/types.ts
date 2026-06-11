export interface User {
  id?: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  phone?: string;
  address?: string;
  wishlist?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

export interface MeasurementColumnLabels {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
}

export interface MeasurementRow {
  sizeLabel: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  measurements?: string;
  measurementColumns?: MeasurementColumnLabels;
  measurementTable?: MeasurementRow[];
  isBabyProduct?: boolean;
  sizes: string[];
  colors: string[];
  reviews: Review[];
  adminRating?: number;
  adminReviewCount?: number;
  tag?: 'New Arrival' | 'Trending' | 'Popular' | 'None';
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  trxId: string;
  status: 'Pending' | 'Packaging' | 'Shipping' | 'Delivered' | 'Cancelled';
  trackingId?: string;
  promoCode?: string;
  discount?: number;
  createdAt?: any;
  updatedAt?: any;
}
