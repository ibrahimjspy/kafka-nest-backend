import { gql } from 'graphql-request';

export const shippingMethodChannelListingMutation = (
  shippingMethodId: string,
) => {
  const DEFAULT_CHANNEL = process.env.DEFAULT_CHANNEL || 'Q2hhbm5lbDox';
  return gql`
    mutation {
      shippingMethodChannelListingUpdate(
        id: "${shippingMethodId}"
        input: { addChannels: [{ channelId: "${DEFAULT_CHANNEL}", price: "10" }] }
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
