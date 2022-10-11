/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {gql} from 'graphql-request';

export const updateProductQuery = (productData, destinationId) => {
  console.log(destinationId,'in query');
  const { id, name, description } = productData;
  return gql`
    mutation{
      productUpdate(
        id:"${destinationId}" 
        input:{
        name:"${name}"
        description:${JSON.stringify(description)}
        seo:{title:"seo title",description:"demo description"},
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
