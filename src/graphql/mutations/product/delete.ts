import { DEFAULT_CHANNEL_ID } from '../../../../common.env';
import { gql } from 'graphql-request';

export const deleteProductMutation = (productId) => {
  return gql`
    mutation{
    productDelete(id:"${productId}"){
        product{
        name
        }
        errors{
         message
        }
    }
    }
`;
};

export const removeChannelListingMutation = (productId) => {
  return gql`
    mutation {
      productChannelListingUpdate(
        id: "${productId}"
        input: {
          updateChannels: {
            channelId: "${DEFAULT_CHANNEL_ID}"
            visibleInListings: false
            isAvailableForPurchase: false
            isPublished: false
          }
        }
      ) {
        product {
          id
          name
        }
        errors {
          message
        }
      }
    }
`;
};
