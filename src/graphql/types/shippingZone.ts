export interface ShippingZoneType {
  edges: {
    node: {
      id: string;
      shippingMethods: {
        id: string;
        name: string;
        metadata: {
          key: string;
          value: string;
        }[];
      }[];
    };
  }[];
}
