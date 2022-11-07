import { gql } from 'graphql-request';

export const createBundleMutation = (
  bundleVariants,
  bundleQuantities,
  shopId,
) => {
  const bundle = gql`
    mutation {
      createBundle(
        Input: {
          name: "test bundle"
          description: "bundle description"
          shopId: "${shopId}"
          variants: [${bundleVariants.map((variantId, key) => {
            return `{ variantId:"${variantId}", quantity: ${bundleQuantities[key]} }`;
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
  return bundle;
};
