export interface BulkProductResults {
  product: {
    id: string;
    externalReference: string;
    media: {
      id: string;
      url: string;
    }[];
    variants: {
      id: string;
      media: {
        url: string;
      }[];
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
  };
}
/**
 * this is scenario where product is failed
 */
export interface BulkProductFail {
  product: null;
}
