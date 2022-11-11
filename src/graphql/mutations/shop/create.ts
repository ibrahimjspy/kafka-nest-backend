import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/transformers/shop';

export const createShopMutation = (
  shopData: shopTransformed,
  userId: string,
) => {
  const { name, description, storePolicy, email, madeIn, returnPolicy, url } =
    shopData;
  const MANAGER_TYPE = process.env.DEFAULT_MANAGER_TYPE || '1';
  return gql`
    mutation {
      createMarketplaceShop(
        input: {
          name: "${name}"
          user: "${userId}"
          managerType: "${MANAGER_TYPE}"
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

export const addUserToMarketplace = (userId: string) => {
  return gql`
  mutation{
  addUserToMarketplace(input:{
    userId:"${userId}"
  }){
    firstName
  }
}
  `;
};
