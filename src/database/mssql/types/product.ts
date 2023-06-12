import { priceInterface } from 'src/transformer/types/product';

export interface productVariantInterface {
  price?: priceInterface;
  sizes?: string[];
  color_list?: colorListInterface[];
  product_id?: string;
  pack_name?: string;
  shoe_bundles?: any;
  shoe_sizes?: any;
  productGroup?: string;
  shoe_bundle_name?: any[];
  variant_media?: any;
  isPreOrder?: string;
  style_name?: string;
  sizeChartId?: number;
}

export interface productDatabaseViewInterface {
  product_id?: string;
  group_id?: number;
  style_name?: string;
  is_hidden?: string;
  style_number?: string;
  group_name?: string;
  category?: string;
  is_plus_size?: number;
  category_id?: string;
  sub_category?: string;
  sub_category_id?: string;
  description?: string;
  default_picture?: string;
  color_image?: string;
  brand_id?: string;
  brand_name?: string;
  brand_web_name?: string;
  fulfillment?: string;
  brand_url?: string;
  vendor_active?: string;
  is_prevention?: boolean;
  patterns?: any;
  sleeves?: any;
  styles?: any;
  is_active?: string;
  is_broken?: boolean;
  is_sale?: string;
  is_preorder?: string;
  available_date?: number;
  is_restock?: string;
  is_sold_out?: string;
  is_prepare?: string;
  pack_name?: string;
  item_sizes?: string;
  popular_point_7?: any;
  popular_point_14?: any;
  popular_point_30?: any;
  popular_point_60?: any;
  pct_1_stars?: any;
  pct_2_stars?: any;
  pct_3_stars?: any;
  pct_4_stars?: any;
  pct_5_stars?: any;
  regular_price?: number;
  price?: number;
  sale_price?: number;
  created_date?: number;
  updated_date?: number;
  color_list?: string;
  ShoeDetails?: string;
  TBSizeChart_ID?: number;
}

export interface shipsFromInterface {
  InvMinAmount?: number;
}

export interface colorListInterface {
  TBColor_ID: string;
  cColorName: string;
}
