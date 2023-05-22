import { gql } from 'graphql-request';

export const deleteShopMutation = (shopData) => {
  return gql`
    mutation {
      deactivateMarketplaceShop(id: "${shopData}") {
        name
      }
    }
  `;
};
