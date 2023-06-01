import { gql } from 'graphql-request';
import { shopTransformed } from 'src/transformer/types/shop';

export const updateShopMutation = (
  shopData: shopTransformed,
  shopId: string,
) => {
  const {
    description,
    storePolicy,
    madeIn,
    returnPolicy,
    minOrder,
    name,
    phoneNumber,
    vendorMainImage,
    banners,
    shippedFrom,
  } = shopData;
  return gql`
    mutation {
      updateMarketplaceShop(
        id: "${shopId}"
        input: {
          name:"${name}"
          madeIn: "${madeIn}"
          minOrder: ${minOrder}
          about: "${description}"
          returnPolicy: "${returnPolicy}"
          storePolicy: "${storePolicy}"
          description: "${description}"
          shippedFrom: "${shippedFrom}"
          fields: [
            { name: "banner", newValues: ${JSON.stringify(banners)} }
            { name: "vendorMainImage", newValues: ["${vendorMainImage}"] }
            { name: "phoneNumber", newValues: ["${phoneNumber}"] }
            ]
        }
      ) {
        id
        name
      }
    }
  `;
};
