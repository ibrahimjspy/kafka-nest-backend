/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { gql } from 'graphql-request';
import { productTransformed } from 'src/types/transformers/product';

export const updateProductMutation = (productData: productTransformed, destinationId) => {
  const { id, name, description } = productData;
  return gql`
    mutation{
      productUpdate(
        id:"${destinationId}" 
        input:{
        name:"${name}"
        # description:${JSON.stringify(description)}
        rating:4
      }){
    product{
      name
      id
      rating
    }
   }
    }
`;
};
