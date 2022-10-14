import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/shop';

export const updateShopMutation = (
  shopData: shopTransformed,
  shopId: string,
) => {
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
      updateMarketplaceShop(
        id: "${shopId}"
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
