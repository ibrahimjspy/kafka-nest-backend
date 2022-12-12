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
