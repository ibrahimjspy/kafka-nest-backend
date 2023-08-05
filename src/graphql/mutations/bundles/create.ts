import { gql } from 'graphql-request';

export const createBundleMutation = (
  bundleVariants,
  shopId,
  price,
  bundleName = 'product variant bundle',
  productId,
) => {
  const bundle = gql`
    mutation {
      createBundle(
        Input: {
          name: "${bundleName}"
          description: "bundle description"
          shopId: "${shopId}"
          productId: "${productId}",
          price: ${price},
          productVariants: [${bundleVariants}] ,
        }
      ){
        ... on BundleViewType {
          __typename
             id
             name
        }
      }  
    } 
  `;
  return bundle;
};
