import { gql } from 'graphql-request';
import { shopTransformed } from 'src/types/transformers/shop';

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
          # redirectUrl: "${url}"
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

export const addProductVariantToShopMutation = (variantId, shopId) => {
  return gql`
    mutation {
      addProductVariantToShop(
        input: {
          productVariantId: "${variantId}"
          shopId: "${shopId}"
        }
      ) {
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
          managerType: "1"
          madeIn: "${madeIn}"
          minOrder: 200
          about: "shop about"
          returnPolicy: "${returnPolicy}"
          # storePolicy: "${storePolicy}"
          email: "${email}"
          url: "${url}"
          description: "${description.slice(0, 50)}"
        }
      ) {
        id
        name
      }
    }
  `;
};
