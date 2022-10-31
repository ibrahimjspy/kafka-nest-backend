import { gql } from 'graphql-request';

export const createBundleMutation = (bundleVariants, shopId) => {
  console.log(shopId);
  return gql`
    mutation {
      createBundle(
        Input: {
          name: "test bundle"
          description: "bundle description"
          shopId: "${shopId}"
          variants: [${bundleVariants.map((bundle) => {
            return `{ variantId:"${bundle.variantId}", quantity: ${bundle.quantity} }`;
          })}] ,
        }
   ){
        ... on BundleViewType {
          __typename
             id
      name
      description
      slug
      shop {
        id
      }
      variants {
        quantity
        variant {
          id
          channel
        }
      }
        }}
        
    } 
  `;
};
