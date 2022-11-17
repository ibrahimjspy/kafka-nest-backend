/**
 *   transforms bundle variants and their quantity array into a string which can be used in graphql query
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const bundleQueryTransformer = (
  bundleVariants,
  bundleQuantities,
): string => {
  return bundleVariants.map((variantId, key): string => {
    return `{ variantId:"${variantId}", quantity: ${bundleQuantities[key]} }`;
  });
};

/**
 *   transforms product variants and their attributes array into a string which can be used in graphql query
 *   @returns string e.g: ["id1","id2", 'id3]
 */
export const productVariantQueryTransformer = (variantIds) => {
  // variant configurations
  const DEFAULT_WAREHOUSE_ID =
    process.env.DEFAULT_WAREHOUSE_ID ||
    ' V2FyZWhvdXNlOjFlYTNkZGEzLTU4MTgtNGQ5OS05NjkyLWNhMWViM2YyMDNmNg==';
  const COLOR_ATTRIBUTE_ID =
    process.env.DEFAULT_COLOR_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE3';
  const SIZE_ATTRIBUTE_ID =
    process.env.DEFAULT_SIZE_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE4';
  const DEFAULT_CHANNEL_ID = process.env.DEFAULT_CHANNEL_ID || 'Q2hhbm5lbDox';

  return variantIds.map((variant) => {
    return `
    {
      attributes: [
      { id: "${COLOR_ATTRIBUTE_ID}", values:["${variant.color}"] }
      { id: "${SIZE_ATTRIBUTE_ID}", values:["${variant.size}"] }
    ]
      channelListings: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${variant.price} }
      stocks: { warehouse:"${DEFAULT_WAREHOUSE_ID}"  quantity: 1000 }
    }
  `;
  });
};
