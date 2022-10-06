/* eslint-disable prettier/prettier */
import {gql} from 'graphql-request';

export const updateProductQuery = (productData, destinationId) => {
  return gql`
    mutation{
      productUpdate(
        id:${destinationId}
        input: {
          name: "${productData.nStyleName}"
          description:"product description test"
          seo: {
            title: "seo title"
            description: "${productData.brand.seo_description || ''}"
          }
          rating: "2"
        }
      )
    }
`;
};
