import { productTransformed } from 'src/transformer/types/product';
import {
  COLOR_ATTRIBUTE_ID,
  COMMISSION_ATTRIBUTE_ID,
  COST_ATTRIBUTE_ID,
  DEFAULT_CHANNEL_ID,
  DEFAULT_PRODUCT_TYPE,
  DEFAULT_WAREHOUSE_ID,
  IS_SHAROVE_FULFILLMENT,
  PATTERNS_ATTRIBUTE_ID,
  RESALE_PRICE_ATTRIBUTE,
  SHOP_ID_ATTRIBUTE_ID,
  SIZE_ATTRIBUTE_ID,
  SLEEVES_ATTRIBUTE_ID,
  STYLES_ATTRIBUTE_ID,
  STYLE_ATTRIBUTE_ID,
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
      { id: "${COST_ATTRIBUTE_ID}", values:["${variant?.price?.salePrice}"] }

    ]
      sku: "${variant.sku}"
      quantityLimitPerCustomer: 1000
      channelListings: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${
      variant.price.salePrice
    } costPrice: ${variant.price.salePrice} }
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

/**
 * this returns product attributes in graphql string which can be used in product create and update
 */
export const getProductAttributesGql = (
  productData: productTransformed,
): string => {
  const {
    styleNumber,
    isSharoveFulfillment,
    patterns,
    sleeves,
    styles,
    shopId,
  } = productData;
  return `[{
    id:"${STYLE_ATTRIBUTE_ID}",
    values:["${styleNumber}"]
  },
  {
    id:"${SHOP_ID_ATTRIBUTE_ID}",
    values:["${shopId}"]
  },
  {
    id:"${IS_SHAROVE_FULFILLMENT}",
    boolean:${isSharoveFulfillment}
  },
  ${
    patterns
      ? `{
    id:"${PATTERNS_ATTRIBUTE_ID}",
    multiselect: ${JSON.stringify(patterns).replace(/"value"/g, 'value')}
  }`
      : ''
  },
  ${
    sleeves
      ? `{
    id:"${SLEEVES_ATTRIBUTE_ID}",
    multiselect: ${JSON.stringify(sleeves).replace(/"value"/g, 'value')}
  }`
      : ''
  },
  ${
    styles
      ? `{
    id:"${STYLES_ATTRIBUTE_ID}",
    multiselect: ${JSON.stringify(styles).replace(/"value"/g, 'value')}
  }`
      : ''
  }
]`;
};

/**
 *   transforms product variants and their attributes array into a string which can be used in graphql query
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const getBulkProductsGql = (products: productTransformed[]) => {
  return products.map((product) => {
    const { shopId, openPack, openPackMinimumQuantity, shopName } = product;
    return `
    {
      name: "${product.name}"
      description: ${JSON.stringify(product.description)}
      category: "${product.categoryId}"
      rating: 4
      productType: "${DEFAULT_PRODUCT_TYPE}"
      channelListings: {
        channelId: "${DEFAULT_CHANNEL_ID}"
        visibleInListings: false
        isAvailableForPurchase: false
        isPublished: false
      }
      metadata: ${productMetadataTransformer(
        shopId,
        openPack,
        openPackMinimumQuantity,
        shopName,
      )}
      variants: [${productVariantQueryTransformer(product.variantsData)}]
    }
  `;
  });
};
