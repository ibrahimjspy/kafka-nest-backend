import { Logger } from '@nestjs/common';
import { deleteProductHandler } from 'src/graphql/handlers/product';
import { removeProductMapping } from 'src/mapping/methods/product';
import { VariantType } from './Product.Variant.types';

/**
 * this function returns a string that could be added to graphql mutation which fetches sku's for product variants
 * @param product variants transformed using product transformer space
 * @param product id --> source product id
 * @returns string of product variants transformed which could be used for skus generation ;
 */
export const getProductVariantsForSku = (
  productVariantData,
  productId: string,
): string => {
  const skuProductVariants = [];
  (productVariantData || []).map((variant) => {
    const skuProductVariant = {};
    skuProductVariant['color'] = variant.color;
    skuProductVariant['size'] = variant.size;
    skuProductVariant['id'] = Number(productId);
    skuProductVariants.push(skuProductVariant);
  });
  return JSON.stringify(skuProductVariants)
    .replace(/"id"/g, 'id')
    .replace(/"color"/g, 'color')
    .replace(/"size"/g, 'size');
};

/**
 *  adds sku generated by sku generator service to product transformer object
 */
export const addSkuToProductVariants = (skuArray, productVariantData) => {
  (productVariantData || []).map((variant, key) => {
    variant['sku'] = skuArray[key]['sku'];
  });
};

/**
 *  @description this validator takes product variants array and product id as input , and checks whether product variant array is valid
 *  and can be used for bundles creation or adding product variants to shop
 *  @param productVariants array ---- []string
 *  @param productId in base64 form ----- string
 *  @returns productVariants if they are valid or falsy promise which reject upcoming promises
 */
export const validateProductVariants = async (
  productVariants: string[],
  productId: string,
) => {
  if (productVariants && productVariants.length) {
    return productVariants;
  }
  Logger.warn(`Rolling back product flow for productId = '${productId}'`);
  await Promise.all([
    deleteProductHandler(productId),
    removeProductMapping(productId),
  ]);
  return null;
};

/**
 * Validates the resale price against the default variant's resale price attribute.
 * @param resalePrice The resale price to validate.
 * @param defaultVariant The default variant containing the resale price attribute.
 * @returns True if the resale price matches the destination resale price, false otherwise.
 */
export const validateResalePrice = (
  resalePrice,
  defaultVariant: VariantType,
): boolean => {
  /**
   * Find the resale price attribute in the default variant's attributes.
   */
  const resalePriceAttribute = defaultVariant.attributes.find(
    (attribute) => attribute.attribute.name === 'Resale Price',
  );

  /**
   * Get the destination resale price from the resale price attribute.
   * Use optional chaining to safely access properties.
   */
  const destinationResalePrice = resalePriceAttribute?.values[0]?.name;

  /**
   * Compare the provided resale price with the destination resale price.
   * Return true if they match, false otherwise.
   */
  return resalePrice === destinationResalePrice;
};
