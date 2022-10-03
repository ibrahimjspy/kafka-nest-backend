import { gql } from 'graphql-request';

export const updateProductMediaMutation = (productMedia, productId) => {
  return gql`
    mutation{
    productMediaCreate(
    input: {
      product:${productId}
      mediaUrl:${productMedia}
    }
  )
} `;
};
