import { gql } from 'graphql-request';

export const addShippingZoneToShopMutation = (
  shopId: string,
  shippingZoneId: string,
) => {
  return gql`
    mutation {
      addShippingZoneToShop(Input: { shopId: "${shopId}", zoneId: "${shippingZoneId}" }) {
        message
      }
    }
  `;
};
