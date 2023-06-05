import {
  COLOR_ATTRIBUTE_ID,
  COMMISSION_ATTRIBUTE_ID,
  COST_ATTRIBUTE_ID,
  DEFAULT_CHANNEL_ID,
  DEFAULT_WAREHOUSE_ID,
  RESALE_PRICE_ATTRIBUTE,
  SIZE_ATTRIBUTE_ID,
} from '../../../common.env';

/**
 *   transforms bundle variants and their quantity array into a string which can be used in graphql query
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const bundleQueryTransformer = (
  bundleVariants,
  bundleQuantities,
): string => {
  return bundleVariants.map((variantId, key): string => {
    return `{ productVariantId:"${variantId}", quantity: ${bundleQuantities[key]} }`;
  });
};

/**
 *   transforms product variants and their attributes array into a string which can be used in graphql query
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const productVariantQueryTransformer = (variants) => {
  return variants.map((variant) => {
    return `
    {
      attributes: [
      { id: "${COLOR_ATTRIBUTE_ID}", values:["${variant.color}"] }
      { id: "${SIZE_ATTRIBUTE_ID}", values:["${variant.size}"] }
      { id: "${COMMISSION_ATTRIBUTE_ID}", values:["10"] }
      { id: "${RESALE_PRICE_ATTRIBUTE}", values:["${
      variant?.price?.retailPrice
    }"] }
      { id: "${COST_ATTRIBUTE_ID}", values:["${variant?.price?.price}"] }

    ]
      sku: "${variant.sku}"
      quantityLimitPerCustomer: 1000
      channelListings: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${
      variant.price.price
    } costPrice: ${variant.price.price} }
      ${variant.preOrder == 'Y' ? ` preorder: { globalThreshold: 1000 }` : ' '}
      ${
        variant.preOrder == 'N'
          ? ` stocks: { warehouse:"${DEFAULT_WAREHOUSE_ID}"  quantity: 1000 }`
          : ' '
      }
    }
  `;
  });
};

/**
 *   transforms product metadata by checking if values are valid and not falsy
 *   @returns string
 */
export const productMetadataTransformer = (
  shopId,
  openPack,
  openPackMinimumQuantity,
  shopName,
): string => {
  return `[{ key: "vendorId", value: "${shopId}" }, ${
    shopName ? `{ key: "vendorName", value: "${shopName}" }` : ''
  },
  { key: "isOpenPack", value: "${openPack}" },  { key: "openPackMinimumQuantity", value: "${openPackMinimumQuantity}" } ]`;
};
