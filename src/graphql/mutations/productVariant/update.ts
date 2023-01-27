import { COST_ATTRIBUTE_ID } from 'common.env';
import { gql } from 'graphql-request';

export const updateProductVariantPricingMutation = (
  productVariantId,
  resalePrice,
) => {
  const DEFAULT_CHANNEL_ID = process.env.DEFAULT_CHANNEL_ID || 'Q2hhbm5lbDox';
  return gql`
      mutation {
        productVariantChannelListingUpdate(
          id: "${productVariantId}"
          input: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${resalePrice}}
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

export const updateProductVariantCostAttributeMutation = (
  productVariantId,
  costPrice,
) => {
  return gql`
    mutation {
      productVariantUpdate(
        id: "${productVariantId}"
        input: { attributes: [{ id: "${COST_ATTRIBUTE_ID}", values: ["${costPrice}"] }] }
      ) {
        productVariant {
          id
        }
      }
    }
  `;
};
