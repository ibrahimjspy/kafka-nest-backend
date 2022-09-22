/* eslint-disable prettier/prettier */
import {gql} from 'graphql-request';

export const updateProductQuery = (productData) => {
  return gql`
    mutation{
  productUpdate(
    id:${productData.product_id}
    input: {
      name: "${productData.name}"
      description:"${productData.name}"
      seo: {
        title: "${productData.brand.seo_title || ''}"
        description: "${productData.brand.seo_description || ''}"
      }
      rating: "${productData.rating}"
    }
  )
}
    `;
};
