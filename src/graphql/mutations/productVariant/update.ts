import { gql } from 'graphql-request';

export const updateProductVariantPricingMutation = (
  productVariantId,
  priceAmount,
) => {
  return gql`
      mutation {
        productVariantChannelListingUpdate(
          id: "${productVariantId}"
          input: { channelId: "Q2hhbm5lbDox", price: ${priceAmount} }
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
