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

export interface productMediaCreate {
  productMediaCreate?: {
    media: {
      id: string;
    };
  };
}

export interface getProductDetailsInterface {
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
      attributes: {
        attribute: {
          id: string;
          name: string;
        };
        values: {
          value: string;
          name: string;
        }[];
      }[];
      pricing?: {
        price: {
          gross: {
            amount: number | string;
          };
        };
      };
    }[];
  };
}

export interface productVariantCreate {
  productVariantCreate?: {
    productVariant: {
      id: string;
      name: string;
    };
    errors: {
      message: string;
    };
  };
}

export interface bulkVariantCreate {
  productVariantBulkCreate?: {
    productVariants: {
      id: string;
      attributes: {
        attribute: {
          id: string;
          name: string;
        };
        values: {
          value: string;
          name: string;
        }[];
      }[];
    }[];
    errors: any[];
  };
}
