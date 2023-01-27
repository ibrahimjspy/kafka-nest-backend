import {
  COLOR_ATTRIBUTE_ID,
  COMMISSION_ATTRIBUTE_ID,
  COST_ATTRIBUTE_ID,
  DEFAULT_CHANNEL_ID,
  DEFAULT_WAREHOUSE_ID,
  SIZE_ATTRIBUTE_ID,
} from 'common.env';

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
      { id: "${COST_ATTRIBUTE_ID}", values:["${
      variant?.price?.purchasePrice
    }"] }

    ]
      sku: "${variant.sku}"
      channelListings: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${
      variant.price.retailPrice
    } }
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
