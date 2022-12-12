import { gql } from 'graphql-request';

export const addShippingMethodToShopMutation = (
  shopId: string,
  shippingMethodId: string[],
) => {
  return gql`
    mutation {
      addMarketplaceShippingMethods(
        shopId: "${shopId}"
        shippingMethodTypeIds: ${JSON.stringify(shippingMethodId)}
      ) {
        __typename
        ... on MarketplaceShop {
          id
          name
        }
        ... on ResultError {
          errors
          message
        }
      }
    }
  `;
};
