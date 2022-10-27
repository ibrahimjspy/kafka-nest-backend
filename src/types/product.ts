export interface productExistingInterface {
  exists: boolean;
  destinationId: string;
}
export interface productDto {
  id: number;
  nStyleName: string;
  nItemDescription: string;
  TBItem_ID: string;
}

export interface productTransformed {
  id?: string;
  name?: string;
  description?: string;
}

export interface productMediaCreate {
  productMediaCreate?: {
    media: {
      id: string;
    };
  };
}

export interface productCreate {
  productCreate?: {
    product: {
      name: string;
      id: string;
      seoTitle: string;
      slug: string;
    };
    errors: any[];
  };
}

export interface colorSelect {
  id: number;
  TBColorSelect_ID: string;
  TBItem_ID: string;
  TBColor_ID: string;
  ImageLink: string;
  BrandActive: string;
}

export interface productDetails {
  product?: {
    name: string;
    media: {
      url: string;
    }[];
    slug: string;
    description: any;
    updatedAt: string;
    variants: {
      id: string;
    }[];
  };
}

export interface productVariantCreate {
  productVariantCreate?: {
    productVariant: {
      id: string;
      name: string;
    };
    errors: any[];
  };
}

export interface productVariantCDC {
  price?: {
    price: number;
    regular_price: number;
  };
  sizes?: string[];
  color_list?: any;
}

export interface productDatabaseView {
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
}
