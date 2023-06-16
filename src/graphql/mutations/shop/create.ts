import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';

export const createShopMutation = (shopData: shopTransformed) => {
  const { name, email, madeIn, returnPolicyPlain, url, minOrder, shippedFrom } =
    shopData;
  return gql`
    mutation {
      createMarketplaceShop(
        input: {
          name: "${name}"
          madeIn: "${madeIn}"
          user: ""
          minOrder: ${minOrder}
          about: ""
          returnPolicy: "${returnPolicyPlain}"
          email: "${email}"
          url: "${url}"
          description: ""
          storePolicy: ""
          shipsFrom: "${shippedFrom}"
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
