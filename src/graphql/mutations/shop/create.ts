import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';

export const createShopMutation = (shopData: shopTransformed) => {
  const {
    name,
    description,
    storePolicy,
    email,
    madeIn,
    returnPolicyPlain,
    url,
    minOrder,
    shippedFrom,
    banners,
    vendorMainImage,
    phoneNumber,
    sizeChart,
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
          returnPolicy: "${returnPolicyPlain}"
          storePolicy: "${storePolicy}"
          email: "${email}"
          url: "${url}"
          description: "${description}"
          shipsFrom: "${shippedFrom}"
          fields: [
            { name: "banner", newValues: ${JSON.stringify(banners)} }
            { name: "vendorMainImage", newValues: ["${vendorMainImage}"] }
            { name: "phoneNumber", newValues: ["${phoneNumber}"] }
            { name: "sizeChart", newValues: ["${sizeChart}"] }
            ]
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
