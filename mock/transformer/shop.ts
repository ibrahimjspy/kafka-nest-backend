import { shopDto, shopTransformed } from 'src/transformer/types/shop';

export const shopCdcMock: shopDto = {
  id: 10045,
  TBVendor_ID: '234',
  VDName: 'Snowpack fetradings 3d2s3',
  VDEMail: 'vallykingtradinfeg23csd134@gmail.com',
  VDFrontDescription: 'description of shop updated',
  SEODescription: 'demon lord',
  SEOTitle: 'seo title',
  VDVendorURL: 'http://localhost:4901133/',
  OSminOrderAMT: 'BTvY',
  VDStorePolicy: 'vendor store policy',
  VDMadeIn: 'China',
  VDReturnPolicy: 'none',
};

export const shopTransformedMock: shopTransformed = {
  id: '234',
  name: 'Snowpack fetradings 3d2s3',
  description: 'description of shop updated',
  seo_description: 'demon lord',
  seo_title: 'seo title',
  email: 'vallykingtradinfeg23csd134@gmail.com',
  url: 'http://localhost:4901133/',
  minOrder: 'BTvY',
  storePolicy: 'vendor store policy',
  madeIn: 'China',
  returnPolicy: 'none',
};
