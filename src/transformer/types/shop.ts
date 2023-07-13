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
  /**
   * this field is linked with os brand score which tells whether a vendor is popular in terms of reviews and order count
   */
  isPopular?: boolean;
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

export interface BrandInterface {
  TBVendor_SQL_ID: string;
  TBVendor_ID: string;
  TBBrandVendor_ID: string;
  TBMajorMarket_ID: string | null;
  AfricanAmerican: 'N' | 'Y';
  AsianEthnicities: 'N' | 'Y';
  Caucasian: 'N' | 'Y';
  LatinAmerican: 'N' | 'Y';
  MiddleEasternEthnicity: 'N' | 'Y';
  NativeAmerican: 'N' | 'Y';
  PacificIslandEthnicity: 'N' | 'Y';
  TBSizeChart_ID: string;
  TBPackNo_ID: string;
  VDName: string;
  VDWebName: string;
  VDName2: string;
  VDAddress: string;
  VDAddress2: string;
  VDCity: string;
  VDState: string;
  VDZip: string;
  VDPhone: string;
  VDFax: string;
  VDEMail: string | null;
  VDContact: string;
  VDContTitle: string;
  fTerm: string;
  VDActive: 'Y' | 'N';
  VDOSVendor: 'Y' | 'N';
  VDRate1: number;
  VDRate2: number;
  VDRate3: number;
  VDCRate1: number;
  VDCRate2: number;
  VDCRate3: number;
  VDImageFrontMain: string | null;
  VDImageVendorMain: string | null;
  VDLogoImage: string | null;
  VDFrontImage: string | null;
  VDIntroduction: string | null;
  VDFrontDescription: string | null;
  VDRegisterDate: Date;
  VDWebUsing: 'Y' | 'N';
  VDAdminUsing: 'Y' | 'N';
  VDWebUsingDomain: 'Y' | 'N';
  VDOwnDomain: 'Y' | 'N';
  TSalesCounting: number;
  TNewArrivalCounting1: number;
  TNewArrivalCounting2: number;
  TNewArrivalCounting3: number;
  TNewArrivalCounting4: number;
  TBVendor_Domain: string;
  TBOwnWebSiteManage: string;
  VDPrivacyPolicy: string | null;
  VDReturnPolicy: string | null;
  VDTermsOfUse: string | null;
  VDContactUs: string | null;
  VDVendorEmail: string;
  VDVendorURL: string;
  VDYoutubeUsing: 'Y' | 'N';
  VDYoutubeURL: string | null;
  VDABLogoOn: 'Y' | 'N';
  VDMinimumOrderAmount: string | null;
  VDWatermarkPositionx: string | null;
  VDWatermarkPositiony: string | null;
  VDWatermarkText: string | null;
  VDWatermarkImage: string | null;
  VDWatermarkFont: string | null;
  VDWatermarkSelect: string | null;
  nDownload: 'Y' | 'N';
  OnisCustomer: 'Y' | 'N';
  VDRegisterEmailTitle: string | null;
  VDRegisterEmailContent: string | null;
  VDForgotEmailTitle: string | null;
  VDForgotEmailContent: string | null;
  VDPurchaseEmailTitle: string | null;
  VDPurchaseEmailContent: string | null;
  VDShipoutEmailTitle: string | null;
  VDShipoutEmailContent: string | null;
  VDApprovedEmailTitle: string | null;
  VDApprovedEmailContent: string | null;
  nAllowSendOSEmail: 'Y' | 'N';
  VDOwnManageOrder: 'Y' | 'N';
  TUpdate: 'Y' | 'N';
  VDClass: 'S' | 'C' | 'P';
  AuthLoginName: string | null;
  AuthTransactionKey: string | null;
  nHomePageLayout: string | null;
  HeadBannerImageA_1: string | null;
  HeadBannerImageA_2: string | null;
  HeadBannerImageA_3: string | null;
  HeadBannerImageA_4: string | null;
  BannerA_Image1: string | null;
  BannerA_Image2: string | null;
  BannerA_Image3: string | null;
  BannerB_Image1: string | null;
  BannerB_Image2: string | null;
  nColorScheme: string | null;
  HeadBannerImageC_1: string | null;
  CCVerifyCode: string;
  BannerImg1: string | null;
  BannerImg2: string | null;
  BannerImg3: string | null;
  BannerImg4: string | null;
  BannerImg5: string | null;
  BannerImg6: string | null;
  BannerImg7: string | null;
  ShippedFrom: string;
  OSminOrderAMT: number;
  EnableDownloadPicture: 'Y' | 'N';
  FeaturedBrand: 'Y' | 'N';
  VDCategory: string;
  copyprevention: boolean;
  OSDescription: string;
  VDPriceLevel: number;
  VDMadeIn: string;
  TBStyleNo_OS_Collection_ID: string;
  VDContactPreference: string | null;
  VDPaidDetail: 'Y' | 'N';
  UPSAcct: string | null;
  VDH1Tag: string;
  VDWhoShipping: string;
  VDFSB: string;
  VDOrderEmail: 'Y' | 'N';
  PictureFee: number;
  ColorSwatchFee: number;
  VDPreOrderActive: 'Y' | 'N';
  VDDiscountFee: number;
  SignUpType: 'F' | 'R';
  VDStoreCredit: number;
  VDUseUPS: boolean;
  VDOwnWebMonthlyFee: number;
  VDMonthlyFee: number;
  VDInvoiceMemo: string | null;
  VDMemo: string;
  VDUseOnlySale: boolean;
  Brand_Rep_Image: string;
  VDMerchantFee: number;
  VDPreAuth: boolean;
  VDPremiumCommission: boolean;
  BuyerStaff: number;
  BuyerStaffTemp: number | null;
  Site: 'OS' | 'VS';
  VDActiveDate: Date;
  AssignedStaff: number;
  SEOTitle: string;
  SEODescription: string;
  VDStorePolicy: string;
  BrandRewardRate: number;
  owner_info: string;
  VendorCollection: string;
  Ein_number: string;
  CorporateName: string;
  internationalShipping: boolean;
  VDInactiveDate: Date | null;
  VDReactiveDate: Date | null;
  api_login_id: string;
  api_transaction_key: string;
  payment_method: string;
  OSFulfillmentType: string;
  SharoveType: string;
  VendorFlatShipping: boolean;
  vendor_name_starts_with: string;
  total_performance: number | null;
  avg_total_score: number;
  count_review: number;
}
