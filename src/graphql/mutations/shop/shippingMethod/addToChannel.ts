import { DEFAULT_CHANNEL_ID } from '../../../../../common.env';
import { gql } from 'graphql-request';

export const shippingMethodChannelListingMutation = (
  shippingMethodId: string,
) => {
  return gql`
    mutation {
      shippingMethodChannelListingUpdate(
        id: "${shippingMethodId}"
        input: { addChannels: [{ channelId: "${DEFAULT_CHANNEL_ID}", price: "10" }] }
      ) {
        shippingMethod {
          id
        }
        errors {
          message
        }
      }
    }
  `;
};
