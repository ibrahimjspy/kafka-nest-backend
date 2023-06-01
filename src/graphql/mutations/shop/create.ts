import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';

export const createShopMutation = (shopData: shopTransformed) => {
  const {
    name,
    description,
    storePolicy,
    email,
    madeIn,
    returnPolicy,
    url,
    minOrder,
    shippedFrom,
  } = shopData;
  return gql`
    mutation {
      createMarketplaceShop(
        input: {
          name: "${name}"
          madeIn: "${madeIn}"
          user: ""
          minOrder: ${minOrder}
          about: "${description}"
          returnPolicy: "${returnPolicy}"
          storePolicy: "${storePolicy}"
          email: "${email}"
          url: "${url}"
          description: "${description}"
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
