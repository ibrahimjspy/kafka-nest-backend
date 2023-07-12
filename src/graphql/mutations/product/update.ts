/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { gql } from 'graphql-request';
import { getProductAttributesGql } from 'src/graphql/utils/transformers';
import { productTransformed } from 'src/transformer/types/product';

export const updateProductMutation = (
  productData: productTransformed,
  destinationId,
) => {
  const { id, name, description, categoryId } = productData;
  return gql`
    mutation{
      productUpdate(
        id:"${destinationId}" 
        input:{
        category:"${categoryId}"
        name:"${name}"
        externalReference:"${id}"
        description:${JSON.stringify(description)}
        attributes: ${getProductAttributesGql(productData)}
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
