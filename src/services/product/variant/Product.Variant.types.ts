import { BundleImportType } from 'src/api/import.dtos';

export interface bundlesCreateInterface {
  variantIds: string[];
  bundle: string[];
  shopId: string;
  productId: string;
  isOpenBundle: boolean;
  productPrice: number;
  importType: BundleImportType;
}

export interface VariantType {
  media: any[];
  pricing: {
    price: {
      gross: {
        amount: number;
      };
    };
  };
  attributes: {
    attribute: {
      name: string;
    };
    values: {
      name: string;
    }[];
  }[];
  id: string;
}

export interface MediaIdsInterface {
  [key: string]: string;
}
