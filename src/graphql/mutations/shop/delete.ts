import { gql } from 'graphql-request';

export const deleteShopMutation = (shopData) => {
  //   const { id, name, description } = vendorData;
  return gql`
    mutation {
      deactivateMarketplaceShop(id: "${shopData}") {
        name
      }
    }
  `;
};
