export interface FailedResponseType {
  status: number;
  message: string;
  errors?: Array<any>;
}

type ProductAttribute = {
  id: string;
  type: 'PRODUCT_TYPE';
};

export type ProductAttributes = {
  attributeOne: ProductAttribute;
  color: ProductAttribute;
  availableColors: ProductAttribute;
  commission: ProductAttribute;
  costPrice: ProductAttribute;
  issharovefulfillment: ProductAttribute;
  patterns: ProductAttribute;
  resalePrice: ProductAttribute;
  sevenDaysPopularity: ProductAttribute;
  shopid: ProductAttribute;
  size: ProductAttribute;
  sku: ProductAttribute;
  sleeves: ProductAttribute;
  styleNumber: ProductAttribute;
  styles: ProductAttribute;
  vendorType: ProductAttribute;
  sixtyDaysPopularity: ProductAttribute;
  thirtyDaysPopularity: ProductAttribute;
  fourteenDaysPopularity: ProductAttribute;
  popularityPoint: ProductAttribute;
};
