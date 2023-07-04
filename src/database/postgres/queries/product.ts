export const updateProductTimestampsQuery = (
  productId: string,
  createdAt: string,
  updatedAt: string,
): string => {
  return `
      UPDATE saleor.product_product
      SET created_at = '${createdAt}', updated_at = '${updatedAt}'
      WHERE id = ${productId};
    `;
};
