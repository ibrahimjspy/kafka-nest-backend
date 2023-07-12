export interface shopDto {
  id: number;
  TBVendor_ID: string;
  VDName: string;
  VDEMail: string;
  VDFrontDescription: string;
  SEODescription: string;
  SEOTitle: string;
  VDVendorURL: string;
  OSminOrderAMT: string;
  VDStorePolicy: string;
  VDMadeIn: string;
  VDReturnPolicy: string;
  VDVendorEmail?: string;
  VDPhone?: string;
  OSDescription?: string;
  VDMinimumOrderAmount?: string;
  VDAddress?: string;
  VDCity?: string;
  Brand_Rep_Image?: string;
  BannerImg1?: string;
  BannerImg2?: string;
  BannerImg3?: string;
  BannerImg4?: string;
  BannerImg5?: string;
  BannerImg6?: string;
  BannerImg7?: string;
  ShippedFrom?: string;
  VDState?: string;
  SharoveType?: string;
  OSFulfillmentType?: string;
  VendorFlatShipping?: number;
}

export interface shopTransformed {
  id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
  seo_description?: string;
  seo_title?: string;
  email?: string;
  url?: string;
  minOrder?: number;
  banners?: string[];
  vendorMainImage?: string;
  storePolicy?: string;
  madeIn?: string;
  returnPolicy?: string;
  shippedFrom?: string;
  sizeChart?: string;
  returnPolicyPlain?: string;
  sizeChartName?: string;
  type?: SharoveTypeEnum | null;
  /**
   * this field is linked with os fulfillment, and tells whether a vendor is in os fulfillment program or not
   */
  flat?: boolean;
  /**
   * this field is linked with vendor own fulfillment flat charge, for now this boolean specifies whether a vendor fulfills order himself with a flat charge or not
   */
  ownFlat?: boolean;
}

export interface shippingMethodDto {
  TBShipMethod_ID?: string;
  SMShipMethodName?: string;
  SMDescription?: string;
}

export interface shippingZoneDto {
  id?: number;
  TBVendor_ID?: string;
  Type?: string;
  Content?: string;
}

export interface shippingZoneTransformedDto {
  shopId?: string;
  zoneId?: string;
}

export interface shopSettingsDto {
  id: number;
  TBVendor_ID: string;
  Type: string;
  Content: string;
}

export enum vendorSettingsEnum {
  RETURN_POLICY = 'return_policy',
  SIZE_CHART = 'size_chart',
}

export enum SharoveTypeEnum {
  ALL = 'All',
  WHOLESALE = 'B2B',
  Retail = 'D2C',
}
export interface DestinationShopInterface {
  id: string;
  name: string;
  email: string;
  url: string;
  madeIn: string;
  minOrder: number;
  description: string;
  about: string;
  returnPolicy: string;
  storePolicy: string;
  shipsFrom: string;
  fields: {
    name: string;
    values: string[];
  }[];
}
