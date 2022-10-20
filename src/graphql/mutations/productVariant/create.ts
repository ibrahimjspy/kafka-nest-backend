import { gql } from 'graphql-request';

export const createProductVariantMutation = (productVariantData, productId) => {
  // parsing product data;
  const { color, size } = productVariantData;
  return gql`
    mutation {
        mutation{
        productVariantCreate(input:{
            attributes:[{id:"QXR0cmlidXRlOjY=" values:["${color}"] },
            { id:"QXR0cmlidXRlOjY="values:["${size}"] }]
            product:"${productId}"
        }){
            productVariant{
            id
            name
            }
            errors{
            message
            }
        }
}
  `;
};
