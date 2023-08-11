/* eslint-disable prettier/prettier */
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
    sizeChart,
    name,
    phoneNumber,
    vendorMainImage,
    banners,
    sizeChartName,
    shippedFrom,
    type,
    flat,
    ownFlat,
  } = shopData;
  const shopTypeField = type ? `{ name: "shopType", newValues: ["${type}"]}`  : `{ name: "shopType", newValues: ["null"]}`;
  const sharoveFulfillment = () =>{
    if(ownFlat == false && flat == true){
      return true
    }
    return false
  }
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
          shipsFrom: "${shippedFrom}"
          fields: [
            { name: "banner", newValues: ${JSON.stringify(banners)} }
            { name: "vendorMainImage", newValues: ["${vendorMainImage}"] }
            { name: "phoneNumber", newValues: ["${phoneNumber}"] }
            { name: "sizeChart", newValues: ["${sizeChart.replace(/"/g, "'")}"] }
            { name: "sizeChartName", newValues: ["${sizeChartName.replace(/"/g, "'")}"] }
            { name: "issharovefulfillment", newValues: ["${sharoveFulfillment()}"] }
            { name: "isownflatshipping", newValues: ["${ownFlat}"] }
            ${shopTypeField}
            ]
        }
      ) {
        id
        name
      }
    }
  `;
};
