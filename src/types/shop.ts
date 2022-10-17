export interface shopTransformed {
  id?: string;
  name?: string;
  description?: string;
  seo_description?: string;
  seo_title?: string;
  email?: string;
  url?: string;
  minOrder?: string;
  storePolicy?: string;
  madeIn?: string;
  returnPolicy?: string;
}

export interface shopCDC {
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
}
