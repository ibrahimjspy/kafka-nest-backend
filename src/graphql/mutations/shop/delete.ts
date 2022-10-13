import { gql } from 'graphql-request';

export const updateShopMutation = (shopData) => {
  //   const { id, name, description } = vendorData;
  return gql`
    mutation {
      deactivateMarketplaceShop(id: "${shopData}") {
        name
      }
    }
  `;
};
