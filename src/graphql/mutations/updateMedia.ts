import { gql } from 'graphql-request';

export const createProductMediaMutation = (productMedia, productId) => {
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
