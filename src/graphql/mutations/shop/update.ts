import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/transformers/shop';

export const updateShopMutation = (
  shopData: shopTransformed,
  shopId: string,
) => {
  const { name, description, storePolicy, email, madeIn, returnPolicy, url } =
    shopData;
  return gql`
    mutation {
      updateMarketplaceShop(
        id: "${shopId}"
        input: {
          name: "${name}"
          # managerType: "2"
          madeIn: "${madeIn}"
          minOrder: 200
          about: "shop about"
          returnPolicy: "${returnPolicy}"
          storePolicy: "${storePolicy}"
          email: "${email}"
          url: "${url}"
          description: "${description}"
        }
      ) {
        id
        name
      }
    }
  `;
};
