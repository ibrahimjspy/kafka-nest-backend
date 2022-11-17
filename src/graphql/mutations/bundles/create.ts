import { gql } from 'graphql-request';

export const createBundleMutation = (bundleVariants, shopId) => {
  const bundle = gql`
    mutation {
      createBundle(
        Input: {
          name: "product variant bundle"
          description: "bundle description"
          shopId: "${shopId}"
          variants: [${bundleVariants}] ,
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
