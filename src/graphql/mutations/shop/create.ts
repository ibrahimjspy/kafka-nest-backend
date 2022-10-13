import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/brand';

export const createShopMutation = (shopData: shopTransformed) => {
  const {
    name,
    description,
    storePolicy,
    minOrder,
    email,
    madeIn,
    returnPolicy,
    url,
  } = shopData;
  return gql`
    mutation {
      createMarketplaceShop(
        input: {
          name: "${name}"
          user: "user id"
          managerType: ${shopData}
          madeIn: "${madeIn}"
          minOrder: "${minOrder}"
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
