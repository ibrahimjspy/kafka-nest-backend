import { productTransformed } from 'src/transformer/types/product';
import {
  COLOR_ATTRIBUTE_ID,
  COMMISSION_ATTRIBUTE_ID,
  COST_ATTRIBUTE_ID,
  DEFAULT_CHANNEL_ID,
  DEFAULT_PRODUCT_TYPE,
  DEFAULT_WAREHOUSE_ID,
  RESALE_PRICE_ATTRIBUTE,
  SIZE_ATTRIBUTE_ID,
} from '../../../common.env';
import { ProductAttributes } from 'src/app.utils.types';

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
  attributes?: ProductAttributes,
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
    id:"${attributes.styleNumber.id}",
    values:["${styleNumber}"]
  },
  {
    id:"${attributes.shopid.id}",
    values:["${shopId}"]
  },
  {
    id:"${attributes.vendorType.id}",
    values:["${productData.type}"]
  },
  {
    id:"${attributes.sevenDaysPopularity.id}",
    values:["${productData.popularity.popularPoint7}"]
  },
  {
    id:"${attributes.fourteenDaysPopularity.id}",
    values:["${productData.popularity.popularPoint14}"]
  },
  {
    id:"${attributes.thirtyDaysPopularity.id}",
    values:["${productData.popularity.popularPoint30}"]
  },
  {
    id:"${attributes.sixtyDaysPopularity.id}",
    values:["${productData.popularity.popularPoint60}"]
  },
  {
    id:"${attributes.popularityPoint.id}",
    values:["${productData.popularity.popularPoint}"]
  },
  {
    id:"${attributes.issharovefulfillment.id}",
    boolean:${isSharoveFulfillment}
  },
  ${
    patterns
      ? `{
    id:"${attributes.patterns.id}",
    multiselect: ${JSON.stringify(patterns).replace(/"value"/g, 'value')}
  }`
      : ''
  },
  ${
    sleeves
      ? `{
    id:"${attributes.sleeves.id}",
    multiselect: ${JSON.stringify(sleeves).replace(/"value"/g, 'value')}
  }`
      : ''
  },
  ${
    styles
      ? `{
    id:"${attributes.styles.id}",
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
