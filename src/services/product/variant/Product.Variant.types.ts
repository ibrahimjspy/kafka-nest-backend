export interface bundlesCreateInterface {
  variantIds: string[];
  bundle: string[];
  shopId: string;
  productId: string;
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
