/* eslint-disable prettier/prettier */
import {gql} from 'graphql-request';

export const updateProductQuery = (productData) => {
  const dynamic_product_queries = () => {
    for (const [key, value] of Object.entries(productData)) {
      return `${key}: ${value}`;
    }
  };
  return gql`
    mutation{
  productUpdate(
    id:${productData.product_id}
    input: {
      ${dynamic_product_queries()}
      price: ${productData.product_catalog_price}
      name: "${productData.name}"
      slug: "${productData.slug}"
      weight: "${productData.weight}"
      rating: "${productData.rating}"
      productType: "$productType"
    }
  )
}
    `;
};
