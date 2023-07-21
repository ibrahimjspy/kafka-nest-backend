import { SharoveTypeEnum } from './shop';

export interface productDto {
  id: number;
  nStyleName: string;
  nItemDescription: string;
  TBItem_ID: string;
  Picture1?: string;
  Picture2?: string;
  Picture3?: string;
  Picture4?: string;
  Picture5?: string;
  Picture6?: string;
  Picture7?: string;
  Picture8?: string;
  Picture9?: string;
  TBStyleNo_OS_Category_Master_ID?: string;
  TBStyleNo_OS_Category_Sub_ID?: string;
  TBVendor_ID?: string;
  nPrice1?: string;
  nPrice2?: string;
  nVendorStyleNo?: string;
  nSalePrice?: string;
  nPurchasePrice?: string;
  nOnSale?: string;
  nVendorActive?: string;
  nActive?: string;
  is_broken_pack?: number;
  min_broken_pack_order_qty?: number;
  nSalePrice2?: number;
  nSoldOut?: string;
  OriginDate?: string;
  nModifyDate?: string;
}

export interface productTransformed {
  id?: string;
  name?: string;
  description?: string;
  media?: mediaDto[];
  categoryId?: string;
  shopId?: string;
  price?: priceInterface;
  styleNumber?: string;
  listing?: boolean;
  openPack?: boolean;
  openPackMinimumQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
  type?: SharoveTypeEnum;
  styles?: {
    value: string;
  }[];
  sleeves?: {
    value: string;
  }[];
  patterns?: {
    value: string;
  }[];
  colors?: {
    value: string;
  }[];
  isSharoveFulfillment?: boolean;
  variantsData?: any[];
  shopName?: string;
}
export interface priceInterface {
  purchasePrice?: string | number;
  salePrice?: string | number;
  onSale?: string | number;
  retailPrice?: string | number;
}
export interface colorSelectDto {
  id: number;
  TBColorSelect_ID: string;
  TBItem_ID: string;
  TBColor_ID: string;
  ImageLink: string;
  BrandActive: string;
}

export interface mediaDto {
  tiny?: string;
  small?: string;
  medium?: string;
  large?: string;
}
