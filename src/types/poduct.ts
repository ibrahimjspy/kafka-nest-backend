export interface productExistingInterface {
  exists: boolean;
  destinationId: string;
}
export interface productCDC {
  id: number;
  nStyleName: string;
  nItemDescription: string;
  TBItem_ID: string;
}

export interface productTransformed {
  id?: string;
  name?: string;
  description?: string;
}

export interface productMediaCreate {
  productMediaCreate?: {
    media: {
      id: string;
    };
  };
}

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
