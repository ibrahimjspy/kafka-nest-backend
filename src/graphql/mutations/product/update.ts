/* eslint-disable prettier/prettier */
import {gql} from 'graphql-request';

export const updateProductQuery = (productData, destinationId) => {
  console.log(destinationId,'in query');
  return gql`
    mutation{
      productUpdate(
    id:"${destinationId}" 
    input:{
    name:"${productData.nStyleName}"
    seo:{title:"seo title",description:"${productData.nItemDescription}"},
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
