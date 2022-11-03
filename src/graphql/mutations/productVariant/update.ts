import { gql } from 'graphql-request';

export const updateProductVariantPricingMutation = (
  productVariantId,
  priceAmount,
) => {
  const DEFAULT_CHANNEL_ID = process.env.DEFAULT_CHANNEL_ID || 'Q2hhbm5lbDox';
  return gql`
      mutation {
        productVariantChannelListingUpdate(
          id: "${productVariantId}"
          input: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${priceAmount} }
        ) {
          variant {
            id
            name
            product {
              id
              name
            }
          }
          errors {
            message
            field
          }
        }
      }
    `;
};
