export interface ProductColor {
  name: string;
  hex: string;
  img?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: 'footwear' | 'outerwear' | 'accessories' | 'tailoring' | 'apparel' | 'acoustics' | string;
  price: number;
  formattedPrice?: string;
  currency?: 'EUR' | 'BDT' | string;
  description: string;
  image: string;
  gallery?: string[];
  materials?: string[];
  sizes?: string[];
  colors?: ProductColor[];
  tag?: string;
  isNew?: boolean;
  rating?: number;
  inStock?: boolean;
  subCategory?: string;
  matchBadge?: string;
  reasoning?: string;
  whyExpanded?: { label: string; desc: string }[];
  tags?: string[];
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
