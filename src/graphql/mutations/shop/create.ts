import { MANAGER_TYPE } from '../../../../common.env';
import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';

export const createShopMutation = (
  shopData: shopTransformed,
  userId: string,
) => {
  const { name, description, storePolicy, email, madeIn, returnPolicy, url } =
    shopData;
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
