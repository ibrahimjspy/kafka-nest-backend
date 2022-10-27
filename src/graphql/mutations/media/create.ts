import { gql } from 'graphql-request';

export const mediaCreateMutation = (productMedia, productId) => {
  return gql`
    mutation{
    productMediaCreate(
    input: {
      product:"${productId}"
      mediaUrl:"${productMedia}"
    }
  ){
    media{
        id
    }
    errors{
      message
      field
    }
  }
} 
`;
};
