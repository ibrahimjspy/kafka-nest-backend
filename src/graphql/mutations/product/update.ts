/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { gql } from 'graphql-request';
import { ProductAttributes } from 'src/app.utils.types';
import { getProductAttributesGql } from 'src/graphql/utils/transformers';
import { productTransformed } from 'src/transformer/types/product';

export const updateProductMutation = (
  productData: productTransformed,
  destinationId,
  attributes: ProductAttributes
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
        attributes: ${getProductAttributesGql(productData, attributes)}
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
