import { gql } from 'graphql-request';

export const productVariantBulkCreateMutation = (
  productVariantData,
  productId,
) => {
  // parsing product variant data;
  const DEFAULT_WAREHOUSE_ID =
    process.env.DEFAULT_WAREHOUSE_ID ||
    ' V2FyZWhvdXNlOjFlYTNkZGEzLTU4MTgtNGQ5OS05NjkyLWNhMWViM2YyMDNmNg==';
  const COLOR_ATTRIBUTE_ID =
    process.env.DEFAULT_COLOR_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE3';
  const SIZE_ATTRIBUTE_ID =
    process.env.DEFAULT_SIZE_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE4';
  const DEFAULT_CHANNEL_ID = process.env.DEFAULT_CHANNEL_ID || 'Q2hhbm5lbDox';

  return gql`
    mutation {
      productVariantBulkCreate(
        product: "${productId}"
        variants: [${productVariantData.map((variant) => {
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
        })}]
      ) {
        productVariants {
          id
          attributes {
            attribute {
              id
              name
            }
            values {
              value
              name
            }
          }
        }
        errors {
          message
        }
      }
    }
  `;
};
