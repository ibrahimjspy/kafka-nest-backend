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
