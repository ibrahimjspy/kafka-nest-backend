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

export interface getProductDetails {
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
    }[];
  };
}

export interface productVariantCreate {
  productVariantCreate?: {
    productVariant: {
      id: string;
      name: string;
    };
    errors: any[];
  };
}
