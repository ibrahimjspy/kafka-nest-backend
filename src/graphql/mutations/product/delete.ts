import { gql } from 'graphql-request';

export const deleteProductMutation = (productId) => {
  return gql`
    mutation{
    productDelete(id:"${productId}"){
        product{
        name
        }
    }
    }
`;
};
