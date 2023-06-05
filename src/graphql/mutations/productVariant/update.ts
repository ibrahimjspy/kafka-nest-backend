import {
  DEFAULT_CHANNEL_ID,
  RESALE_PRICE_ATTRIBUTE,
} from '../../../../common.env';
import { gql } from 'graphql-request';

export const updateProductVariantPricingMutation = (
  productVariantId,
  costPrice,
) => {
  return gql`
      mutation {
        productVariantChannelListingUpdate(
          id: "${productVariantId}"
          input: { channelId: "${DEFAULT_CHANNEL_ID}", price: ${costPrice}}
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

export const updateProductVariantResaleAttributeMutation = (
  productVariantId,
  resalePrice,
) => {
  return gql`
    mutation {
      productVariantUpdate(
        id: "${productVariantId}"
        input: { attributes: [{ id: "${RESALE_PRICE_ATTRIBUTE}", values: ["${resalePrice}"] }] }
      ) {
        productVariant {
          id
        }
      }
    }
  `;
};
