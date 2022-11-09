import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/transformers/shop';

export const updateShopMutation = (
  shopData: shopTransformed,
  shopId: string,
) => {
  const { description, storePolicy, madeIn, returnPolicy } = shopData;
  return gql`
    mutation {
      updateMarketplaceShop(
        id: "${shopId}"
        input: {
          # managerType: "2"
          madeIn: "${madeIn}"
          minOrder: 200
          about: "shop about"
          returnPolicy: "${returnPolicy}"
          storePolicy: "${storePolicy}"
          description: "${description}"
        }
      ) {
        id
        name
      }
    }
  `;
};
