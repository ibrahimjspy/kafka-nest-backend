import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/shop';

export const createShopMutation = (
  shopData: shopTransformed,
  userId: string,
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
      createMarketplaceShop(
        input: {
          name: "${name}"
          user: "${userId}"
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

export const createUserMutation = (shopData: shopTransformed) => {
  const { name, email, url } = shopData;
  return gql`
    mutation {
      staffCreate(
        input: {
          firstName: "${name}"
          email: "${email}"
          isActive: true
          addGroups: ["fd"]
          redirectUrl: "${url}"
        }
      ) {
        user {
          id
        }
        errors {
          message
          code
          field
        }
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
