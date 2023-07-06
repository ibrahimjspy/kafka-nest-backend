import { DestinationShopInterface } from 'src/transformer/types/shop';

/**
 *  this function validates shipping methods array if array is empty it creates an array with default shipping address
 *  @params shipping method array
 *  @params fallback -- default shipping method id
 *  @returns shipping method array to be mapped
 */
export const shippingMethodValidation = (
  arr: string[],
  shippingMethodId: string,
) => {
  if (arr.length) {
    return arr;
  }
  return [`${shippingMethodId}`];
};

/**
 *  returns shop type value for a destination shop
 */
export const getDestinationShopType = (
  destinationShopData: DestinationShopInterface,
): string | null => {
  const SHOP_TYPE_FIELD_KEY = 'shoptype';

  const shopTypeField = destinationShopData.fields.find(
    (field) => field.name === SHOP_TYPE_FIELD_KEY,
  );

  return shopTypeField?.values[0] || null;
};
