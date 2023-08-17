/**
 * Gets the encoded product ID for a given product.
 * @param {ProductProduct} product - The product object.
 * @returns {string} The encoded category ID.
 */
export const getEncodedProductId = (id: string) => {
  return btoa(`Product:${id}`);
};
